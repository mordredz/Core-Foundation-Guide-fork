<!-- src/lib/components/NeuralBackground.svelte -->
<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { loadP5 } from '$lib/utils/p5loader';

	// EN: Container element that hosts the p5 canvas.
	// IT: Elemento contenitore che ospita la canvas di p5.
	let container!: HTMLDivElement;

	// EN: p5 instance, kept so it can be torn down on destroy.
	// IT: Istanza di p5, conservata per poterla distruggere allo smontaggio.
	let p5Instance: any;

	// EN: A single particle: manages its own position, velocity and appearance.
	// IT: Una singola particella: gestisce la propria posizione, velocità e aspetto.
	class Particle {
		p: any;
		pos: any;
		vel: any;
		acc: any;
		maxSpeed = 1;
		isAccent: boolean; // EN: ~10% of particles use the accent color. / IT: ~10% delle particelle usa il colore d'accento.

		constructor(p: any) {
			this.p = p;
			this.pos = p.createVector(p.random(p.width), p.random(p.height));
			this.vel = p.constructor.Vector.random2D();
			this.vel.setMag(p.random(0.5, 1.5));
			this.acc = p.createVector(0, 0);
			this.isAccent = p.random(1) < 0.1;
		}

		update() {
			this.vel.add(this.acc);
			this.vel.limit(this.maxSpeed);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.edges();
		}

		// EN: Wrap around the screen edges.
		// IT: Riavvolge ai bordi dello schermo.
		edges() {
			if (this.pos.x > this.p.width) this.pos.x = 0;
			if (this.pos.x < 0) this.pos.x = this.p.width;
			if (this.pos.y > this.p.height) this.pos.y = 0;
			if (this.pos.y < 0) this.pos.y = this.p.height;
		}

		show() {
			this.p.noStroke();
			this.p.fill(this.isAccent ? 'rgba(250, 204, 21, 0.7)' : 'rgba(34, 211, 238, 0.5)');
			this.p.circle(this.pos.x, this.pos.y, 4);
		}
	}

	onMount(async () => {
		// EN: Load p5 lazily on the client only.
		// IT: Carica p5 in modo lazy, solo sul client.
		const p5 = await loadP5();

		// EN: Use lighter settings on touch devices to save resources.
		// IT: Usa impostazioni più leggere sui dispositivi touch per risparmiare risorse.
		const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

		const sketch = (p: any) => {
			let particles: Particle[] = [];
			const numParticles = isMobile ? 30 : 60;
			const connectDistance = isMobile ? 100 : 130;

			p.setup = () => {
				p.createCanvas(p.windowWidth, p.windowHeight).parent(container);
				for (let i = 0; i < numParticles; i++) particles.push(new Particle(p));
				if (isMobile) p.frameRate(30);
			};

			p.draw = () => {
				p.background('#0a0a0a');

				particles.forEach((particle) => {
					particle.update();
					particle.show();
				});

				// EN: Connect nearby particles with a line whose opacity fades with distance.
				// IT: Collega le particelle vicine con una linea la cui opacità sfuma con la distanza.
				for (let i = 0; i < particles.length; i++) {
					for (let j = i + 1; j < particles.length; j++) {
						const d = p.dist(
							particles[i].pos.x,
							particles[i].pos.y,
							particles[j].pos.x,
							particles[j].pos.y
						);

						if (d < connectDistance) {
							const alpha = p.map(d, 0, connectDistance, 0.2, 0);
							p.stroke(`rgba(224, 224, 224, ${alpha})`);
							p.line(
								particles[i].pos.x,
								particles[i].pos.y,
								particles[j].pos.x,
								particles[j].pos.y
							);
						}
					}
				}
			};

			p.windowResized = () => p.resizeCanvas(p.windowWidth, p.windowHeight);
		};

		p5Instance = new p5(sketch, container);
	});

	// EN: Tear down the p5 instance (canvas + draw loop) to avoid a memory leak.
	// IT: Distrugge l'istanza di p5 (canvas + loop di draw) per evitare un memory leak.
	onDestroy(() => {
		p5Instance?.remove();
	});
</script>

<!-- EN: Fixed, full-screen canvas sitting behind all content. -->
<!-- IT: Canvas fissa a tutto schermo, posizionata dietro a tutti i contenuti. -->
<div bind:this={container} class="fixed left-0 top-0 -z-10 h-full w-full"></div>
