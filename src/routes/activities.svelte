<script>
    import { fade, fly } from 'svelte/transition';
	let beachToggled = false;
	let walkToggled = false;
	let workshopToggled = false;
</script>

<svelte:head>
	<title>Activities Page</title>
</svelte:head>

<div class="main">
     <!-- Beach Section
    --------------------------------------------- -->
      
    <div id="beach">
        <label>
            <div class="activityHeading">
                <div class="activityImage">
                    <picture>
                        <source
                            type="image/avif"
                            srcset="
                            /img/Optimized/beachDay-400.avif 400w,
                            /img/Optimized/beachDay-600.avif 600w,
                            /img/Optimized/beachDay-800.avif 800w,
                            /img/Optimized/beachDay-1000.avif 1000w,
                            /img/Optimized/beachDay-1500.avif 1500w,
                            /img/Optimized/beachDay-1800.avif 1800w,
                            /img/Optimized/beachDay-2000.avif 2000w,"
                            sizes="50vw"/>
                        <source
                            type="image/jpg"
                            srcset="
                            /img/Optimized/beachDay-400.jpg 400w,
                            /img/Optimized/beachDay-600.jpg 600w,
                            /img/Optimized/beachDay-800.jpg 800w,
                            /img/Optimized/beachDay-1000.jpg 1000w,
                            /img/Optimized/beachDay-1500.jpg 1500w,
                            /img/Optimized/beachDay-1800.jpg 1800w,
                            /img/Optimized/beachDay-2000.jpg 2000w,"
                            sizes="50vw"/>
                        <img src="/img/Optimized/beachDay-400.jpg" alt="Kata playing with a girl at the beach" />
                    </picture>
                </div>
                <div class="activityTitle"> <h1>Beach Days<br />
                    {#if beachToggled}
                        <svg width="100px" height="100px" alt="less information Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M14 22v4h20v-4H14zM24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"/></svg>
                    {:else}
                        <svg width="100px" height="100px" alt="more information Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M26 14h-4v8h-8v4h8v8h4v-8h8v-4h-8v-8zM24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"/></svg>
                    {/if}
                </h1> </div>
            </div>
            <input class="hidden" type="checkbox" bind:checked={beachToggled}>
        </label>
        {#if beachToggled}
        <div class="expander" in:fly="{{ y: -600, duration: 2000 }}" out:fade>
            <div class="activityCard">
                <h1>Let us use our beautiful beaches to create a space for kids where they can run, play, enjoy and learn.</h1>
                <p>Depending on the age of the children I offer beach activities for kids. Creative projects, playing games, beach clean ups, …</p>
                <p>Whether you are on vacation here or resident, I got some amazing energy-burning activities to keep kids busy!</p>
                <p>Aside from the obligatory sandcastle building and paddling there are many other fun and creative beach activities that the kids will love.</p>
                <p>"Kids and adults often have different wants and motivations at the beach. Kids use beach time as an opportunity to run, swim and play while parents often want to use a beach trip for a much-needed time to relax," explains Dan DeFigio, author of "Beach Games for Kids."</p>
                <p>"Staying active is one of the best ways for kids to beat boredom at the beach. Sand and water make a different environment than the typical backyard, so kids can explore while having fun."</p>
                <p>Check the dates and sign up your kids for some beach fun!</p>   
            </div>
        </div>
        {/if}    
    </div>

     <!-- walk Section
    --------------------------------------------- -->

    <div id="walk" >
        <label>
            <div class="activityHeading">
                <div class="activityTitle"><h1>Nature Walks<br />
                    {#if walkToggled}
                        <svg width="100px" height="100px" alt="less information Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M14 22v4h20v-4H14zM24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"/></svg>
                    {:else}
                        <svg width="100px" height="100px" alt="more information Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M26 14h-4v8h-8v4h8v8h4v-8h8v-4h-8v-8zM24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"/></svg>
                    {/if}
                </h1> </div>
                <div class="activityImage">
                    <picture>
                        <source
                            type="image/avif"
                            srcset="
                            /img/Optimized/forestWalk-400.avif 200w,
                            /img/Optimized/forestWalk-600.avif 300w,
                            /img/Optimized/forestWalk-667.avif 330w"
                            sizes="(min-width: 500px) 700px, 104vw"/>
                        <source
                            type="image/avif"
                            srcset="
                            /img/Optimized/forestWalk-400.jpg 200w,
                            /img/Optimized/forestWalk-600.jpg 300w,
                            /img/Optimized/forestWalk-667.jpg 300w"
                            sizes="(min-width: 500px) 700px, 104vw"/>
                    <img src="/img/Optimized/forestWalk-400.jpg" alt="Child standing on a big fallen log in the middle of the forest" />
                    </picture>
                </div>
            </div>
            <input class="hidden" type="checkbox" bind:checked={walkToggled}>
        </label>
        {#if walkToggled}
        <div class="expander" in:fly="{{ y: -600, duration: 2000 }}" out:fade>
            <div class="activityCard">
                <h1>
                    Getting outside is a great way to learn more about the environment and is vital for the kids well-being.
                </h1>
                <p>Having fun and enjoying life, curiosity, the joy of discovery and spontaneity is in my work the priorities for education in order to have healthy, active and life-affirming children. Nature offers the ideal conditions for that.</p>
                <p>Kids love to play in nature. Every sensory perception is nourishment for the brain, whether balancing over trees roots, exploring nature, run, walk…</p>
                <p>I offer different activities in nature, check the dates!</p>       
            </div>
        </div>
        {/if}
    </div>
     <!-- workshop Section
    --------------------------------------------- -->

    <div id="workshop">
        <label>
            <div class="activityHeading">
                <div class="activityImage">
                    <picture>
                        <source
                            type="image/avif"
                            srcset="
                            /img/Optimized/workshop-400.avif 200w,
                            /img/Optimized/workshop-600.avif 300w,
                            /img/Optimized/workshop-800.avif 400w,
                            /img/Optimized/workshop-1000.avif 500w,
                            /img/Optimized/workshop-1200.avif 600w,
                            /img/Optimized/workshop-1500.avif 750w,
                            /img/Optimized/workshop-1800.avif 900w,
                            /img/Optimized/workshop-2000.avif 1000w,"
                            sizes="(min-width: 500px) 700px, 100vw"/>
                        <source
                            type="image/jpg"
                            srcset="
                            /img/Optimized/workshop-400.jpg 200w,
                            /img/Optimized/workshop-600.jpg 300w,
                            /img/Optimized/workshop-800.jpg 400w,
                            /img/Optimized/workshop-1000.jpg 500w,
                            /img/Optimized/workshop-1200.jpg 600w,
                            /img/Optimized/workshop-1500.jpg 750w,
                            /img/Optimized/workshop-1800.jpg 900w,
                            /img/Optimized/workshop-2000.jpg 1000w,"
                            sizes="(min-width: 500px) 700px, 100vw"/>
                        <img src="/img/Optimized/workshop-400.jpg" alt="Creative workshop with crayons glue and other crafts" />
                    </picture>
                </div>
                <div class="activityTitle"> <h1>Creative Workshops<br />
                    {#if workshopToggled}
                        <svg width="100px" height="100px" alt="less information Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M14 22v4h20v-4H14zM24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"/></svg>
                    {:else}
                        <svg width="100px" height="100px" alt="more information Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M26 14h-4v8h-8v4h8v8h4v-8h8v-4h-8v-8zM24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.82 0-16-7.18-16-16S15.18 8 24 8s16 7.18 16 16-7.18 16-16 16z"/></svg>
                    {/if}
            </h1> </div>
            </div>
            <input class="hidden" type="checkbox" bind:checked={workshopToggled}>
        </label>
        {#if workshopToggled}
        <div class="expander" in:fly="{{ y: -600, duration: 2000 }}" out:fade>
            <div class="activityCard">
                <h1>
                    Get together and let the kids express themselves freely and discover the creative spirit!
                </h1>
                <p>I offer creative workshops in the “ Studio Coracao” in Vila do Bispo.</p>
                <p>Whether it’s drawing, painting, cutting, pasting, modelling, making or make believe, all children love being creative if they’re given the chance. And there’s so many important developmental benefits of creative play, why wouldn’t you want to encourage it. I want to create a space for kids where they can be creative and have fun. 
                    Check the dates for more info. </p>
      
            </div>
        </div>
        {/if}
    
    </div>
</div>

<style>
.main {
    margin-top: 60px;
}
svg {
    margin-top: 50px;
    fill: rgba(255, 255, 255, 0.75);
}
#beach svg {
    fill: #c68e5d;
}
.activityHeading {
    display: flex;
    flex-direction:row;
    align-items: center;
}
.activityImage {
    height: 300px;
    width: 50%;
}
.activityImage img{
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.activityTitle {
    width: 50%;
    text-align: center;
}
.activityHeading:hover h1{
    text-decoration: underline;
    text-decoration-color: inherit;
}

#beach {
    background-color: #ffffff;
}
#walk {
    background-color: #8e9fae;
}
#workshop {
    background-color: #c68e5d;
}
#beach h1 {
    color: #c68e5d;
}
.expander {
    display:flex;
    flex-direction: column;
    align-items: center;
}
.activityCard {
    margin: 50px 0 50px 0;
    width: 90%;
    max-width: 1000px;
}

@media screen and (min-width: 780px) {
    .activityHeading {
        height: 50vw;
    }
    .activityImage {
        height: 50vw;
    }
}
p {
    text-align: justify;
}
</style>
    
    