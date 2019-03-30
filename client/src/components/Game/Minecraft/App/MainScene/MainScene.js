import React, { Component } from 'react'
import { Mutation, Query, Subscription } from 'react-apollo'
import * as THREE from 'three'
import Stats from 'stats-js'

import { Camera, Light, Player, Renderer } from '../Bin'
import classes from './MainScene.module.css'
import World from '../Bin/World/World'
import { UPDATE_PLAYER_MUTATION } from '../../../../../lib/graphql/mutations'
import { WORLD_QUERY, CHUNK_SUBSCRIPTION } from '../../../../../lib/graphql'
import { Hint } from '../../../../Utils'
import Config from '../../Data/Config'

class MainScene extends Component {
	constructor(props) {
		super(props)

		this.initPos = null
		this.initDirs = null

		this.prevPos = {}
		this.prevDirs = {}

		this.playerChunks = ''

		this.updatePlayer = null
	}

	handleQueryComplete = () => {
		// Prerequisites
		window.requestAnimationFrame =
			window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(f) {
				return setTimeout(f, 1000 / 60)
			} // simulate calling code 60

		window.cancelAnimationFrame =
			window.cancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			function(requestID) {
				clearTimeout(requestID)
			} //fall back

		// Main scene creation
		this.scene = new THREE.Scene()
		this.scene.background = new THREE.Color(0xffffff)
		this.scene.fog = new THREE.Fog(Config.fog.color, Config.fog.near, Config.fog.far)

		// Main renderer constructor
		this.renderer = new Renderer(this.scene, this.mount)

		// Components instantiations
		this.camera = new Camera(this.renderer.threeRenderer)
		this.light = new Light(this.scene)
		this.light.place('hemi')
		this.light.place('ambient')
		this.light.place('point')

		// Player initialization
		this.player = new Player(
			this.camera.threeCamera,
			this.scene,
			this.mount,
			this.blocker,
			this.initPos,
			this.initDirs
		)

		// Stats creation
		this.stats = new Stats()
		this.mount.appendChild(this.stats.dom)

		/** TEST */
		// const geometry = new THREE.BoxGeometry(1, 1, 1)
		// const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
		// this.cube = new THREE.Mesh(geometry, material)
		// this.scene.add(this.cube)
		/** */

		this.init()

		this.updatePosCall = setInterval(() => {
			const playerCoords = this.player.getCoordinates(),
				playerDirs = this.player.getDirections()

			// Making sure no values are null
			for (let member in playerCoords)
				if (playerCoords[member] !== 0 && !playerCoords[member]) return
			for (let member in playerDirs)
				if (playerDirs[member] !== 0 && !playerDirs[member]) return

			if (
				!(JSON.stringify(playerCoords) === JSON.stringify(this.prevPos)) ||
				!(JSON.stringify(playerDirs) === JSON.stringify(this.prevDirs))
			) {
				this.updatePlayer({
					variables: {
						id: this.currentPlayer.id,
						...playerCoords,
						...playerDirs
					}
				})
				this.prevPos = { ...playerCoords }
				this.prevDirs = { ...playerDirs }
			}
		}, 200)
	}

	componentWillUnmount() {
		this.terminate()
		this.mount.removeChild(this.renderer.threeRenderer.domElement)
		clearInterval(this.updatePosCall)
	}

	init = () => {
		this.world = new World(this.scene, this.worldData)

		window.addEventListener('resize', this.onWindowResize, false)
		if (!this.frameId) this.frameId = window.requestAnimationFrame(this.animate)
	}

	terminate = () => {
		window.cancelAnimationFrame(this.frameId)
	}

	animate = () => {
		this.stats.begin()
		this.update()

		this.renderScene()
		this.stats.end()
		if (!document.webkitHidden)
			this.frameId = window.requestAnimationFrame(this.animate)
	}

	update = () => {
		this.player.update()
	}

	renderScene = () => {
		this.renderer.render(this.scene, this.camera.threeCamera)
	}

	onWindowResize = () => {
		this.camera.updateSize(this.renderer.threeRenderer)
		this.renderer.updateSize()
	}

	render() {
		const { username, id: worldId } = this.props

		return (
			<Query
				query={WORLD_QUERY}
				variables={{ query: worldId }}
				onError={err => console.error(err)}
				fetchPolicy="network-only"
				onCompleted={() => this.handleQueryComplete()}>
				{({ loading, data }) => {
					if (loading) return <Hint text="Loading world..." />
					if (!data) return <Hint text="World not found." />

					const { world } = data

					this.worldData = world
					this.currentPlayer = world.players.find(
						ele => ele.user.username === username
					)
					this.initPos = {
						x: this.currentPlayer.x,
						y: this.currentPlayer.y,
						z: this.currentPlayer.z
					}
					this.initDirs = {
						dirx: this.currentPlayer.dirx,
						diry: this.currentPlayer.diry
					}

					return (
						<Mutation
							mutation={UPDATE_PLAYER_MUTATION}
							onError={err => console.error(err)}
							onCompleted={({ updatePlayer: { loadedChunks } }) => {
								if (this.playerChunks !== loadedChunks) {
									// Update world's player chunk according to player's position
									this.world.requestMeshUpdate(
										this.player.getCoordinates()
									)
									// Update existing playerChunks
									this.playerChunks = loadedChunks
								}
							}}>
							{updatePlayer => {
								this.updatePlayer = updatePlayer // Hooked updatePlayer for outter usage

								return (
									<div
										style={{
											width: '100%',
											height: '100%'
										}}
										ref={mount => (this.mount = mount)}>
										<div
											className={classes.blocker}
											ref={blocker => (this.blocker = blocker)}
										/>
										<Subscription
											subscription={CHUNK_SUBSCRIPTION}
											variables={{ worldId }}
											onSubscriptionData={async ({
												subscriptionData: {
													data: { chunk }
												}
											}) => {
												const { node } = chunk
												await this.world
													.registerChunk(node)
													.then(() =>
														console.log('chunk loaded.')
													)
											}}
										/>
									</div>
								)
							}}
						</Mutation>
					)
				}}
			</Query>
		)
	}
}

export default MainScene