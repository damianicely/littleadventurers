<script context="module">
	// remember to run
	//  npm install --save @tryghost/content-api

	import GhostContentAPI from '@tryghost/content-api'

	export async function load(ctx) {
		const api = new GhostContentAPI({
			url: 'http://localhost:2368',
			key: '7c7911e1b9a93215b8f1400113',
			version: 'v3'
		})
        let slug = ctx.page.params.slug
		try {
			const post = await api.posts.read( {slug}, {formats: ['html']} )
			return { props:{ "post": post }}
		} catch (err){
			if (err.errorType === 'NotFoundError')
			return { props:{ 
				"post": { 
					title:"Sorry This Post Doesn't Exist",
					html:"<p>Message me if you think I should write it up!</p>"}
			}}
		}
	
	}
</script>

<script>
	export let post
    console.log(post);
</script>

<svelte:head>
	<title>{post.title} </title>
</svelte:head>

<main>
    <div class="blogpost">
        <h1> {post.title} </h1>
    
        {@html post.html}
    </div>
    
</main>

<style>
	main {
        display: grid;
        grid-template-columns: 5vw 1fr 5vw;
        grid-template-areas: ". blogpost .";
	}
    @media( min-width: 600px ) {
        main {
            display: grid;
            grid-template-columns: 10vw 1fr 10vw;
            grid-template-areas: ". blogpost .";
        }
    }
    @media( min-width: 800px ) {
        main {
        display: grid;
        grid-template-columns: 15vw 1fr 15vw;
        grid-template-areas: ". blogpost .";
        }

    }


    .blogpost {
        margin-top: min(200px);
        grid-area: blogpost;
    }
    h1 {
        color:blanchedalmond;
        margin-bottom: 75px;
    }

</style>
