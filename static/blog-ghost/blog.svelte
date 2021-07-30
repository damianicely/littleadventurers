<script context="module">
	// remember to run
	//  npm install --save @tryghost/content-api

	import GhostContentAPI from '@tryghost/content-api'

	export async function load() {
		const api = new GhostContentAPI({
			url: 'http://localhost:2368',
			key: '7c7911e1b9a93215b8f1400113',
			version: 'v3'
		})
		try {
			const jsonPosts = await api.posts.browse({ limit:5, include: 'tags, authors'})
			return { props:{ "posts": jsonPosts }}
		} catch (err){
			console.log(err);
		}
	
	}

</script>

<script>
	export let posts
</script>

<svelte:head>
	<title>Blog</title>
</svelte:head>

<main>
    <div class="content">
        <h1>Read on to learn about childcare...</h1>
    <ul>
        {#each posts as post}
            <li><a href="/blog/{post.slug}">{post.title}</a></li>
        {/each}
    </ul>
    </div>  
</main>

<style>
	main {
        display: grid;
        grid-template-columns: 20vw 1fr 20vw;
        grid-template-areas: ". content .";
	}
    .content {
        margin-top: min(5vh, 50px);
        grid-area: content;
    }
    ul {
        list-style: none;
    }
    li {
        margin-top: 15px;
    }
    li a{
        font-family: 'Lora', serif;
        font-style: normal;
        font-weight: 700;
        font-size: 1.5em;
        color: burlywood;
    }
</style>
