<script>
	import '../app.css';
  import Footer from '$lib/Footer/index.svelte';
  import Nav from '$lib/Nav/index.svelte';
</script>

<Nav />
<div class="parallax">
  <slot />
  <Footer />
</div>

<style>
  .parallax {
    background-color: var(--background);
    height: 500px;
    /* fallback for older browsers */
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-perspective: 300px;
    perspective: 300px;
    -webkit-perspective-origin-x: 100%;
    -ms-perspective-origin-x: 100%;
  }
</style>