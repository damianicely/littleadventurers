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
                <div id="beachImage" class="activityImage"></div>
                <div class="activityTitle"> <h1>Beach Days<br />
                    {#if beachToggled}^{:else}+{/if}
                </h1> </div>
            </div>
            <input class="hidden" type="checkbox" bind:checked={beachToggled}>
        </label>
        {#if beachToggled}
        <div class="expander" in:fade out:fade>
            <div class="activityCard">
                <h1>
                    Sand Time
                </h1>
                <p>Let us use our beautiful beaches to create a space for kids where they can run, play, enjoy and learn.</p>
                <p>Depending the age of the children I offer beach activities for kids. Creative projects, playing games, beach clean ups, …</p>
                <p>Whether you are on vacation here or resident, I got some amazing energy-burning activities to keep kids busy!</p>
                <p>Aside from the obligatory sandcastle building and paddling there are many other fun and creative beach activities that the kids will love.</p>
                <p>"Kids and adults often have different wants and motivations at the beach. Kids use beach time as an opportunity to run, swim and play while parents often want to use a beach trip for a much-needed time to relax," explains Dan DeFigio, author of "Beach Games for Kids."</p>
                <p>"Staying active is one of the best ways for kids to beat boredom at the beach. Sand and water make a different environment than the typical backyard, so kids can explore while having fun."</p>        
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
                    {#if walkToggled}-{:else}+{/if}
                </h1> </div>
                <div id="walkImage" class="activityImage"></div>
            </div>
            <input class="hidden" type="checkbox" bind:checked={walkToggled}>
        </label>
        {#if walkToggled}
        <div class="expander" in:fly="{{ y: -600, duration: 2000 }}" out:fade>
            <div class="activityCard">
                <h1>
                    Flies in, fades out
                </h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, rerum recusandae? Dolor aperiam tempore praesentium nesciunt enim vero, ratione neque magni autem ab cumque non corrupti tempora deserunt dolorem dignissimos.</p>        
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, rerum recusandae? Dolor aperiam tempore praesentium nesciunt enim vero, ratione neque magni autem ab cumque non corrupti tempora deserunt dolorem dignissimos.</p>        
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor, rerum recusandae? Dolor aperiam tempore praesentium nesciunt enim vero, ratione neque magni autem ab cumque non corrupti tempora deserunt dolorem dignissimos.</p>        
            </div>
        </div>
        {/if}
    </div>
     <!-- workshop Section
    --------------------------------------------- -->

    <div id="workshop">
        <label>
            <div class="activityHeading">
                <div id="workshopImage" class="activityImage"></div>
                <div class="activityTitle"><h1>Nature Walks</h1></div>
            </div>
            <input class="hidden" type="checkbox" bind:checked={workshopToggled}>
        </label>
        {#if workshopToggled}
        <div class="expander" in:fly="{{ y: -600, duration: 2000 }}" out:fade>
            <div class="activityCard">
                <h1>
                    Flies in, fades out
                </h1>
                <p>Let us use our beautiful beaches to create a space for kids where they can run, play, enjoy and learn.</p>
                <p>Depending the age of the children I offer beach activities for kids. Creative projects, playing games, beach clean ups, …</p>
                <p>Whether you are on vacation here or resident, I got some amazing energy-burning activities to keep kids busy!</p>
                <p>Aside from the obligatory sandcastle building and paddling there are many other fun and creative beach activities that the kids will love.</p>
                <p>"Kids and adults often have different wants and motivations at the beach. Kids use beach time as an opportunity to run, swim and play while parents often want to use a beach trip for a much-needed time to relax," explains Dan DeFigio, author of "Beach Games for Kids."</p>
                <p>"Staying active is one of the best ways for kids to beat boredom at the beach. Sand and water make a different environment than the typical backyard, so kids can explore while having fun."</p>        
            </div>
        </div>
        {/if}
    
    </div>
</div>

<style>
.main {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
}
.activityHeading {
    height: 300px;
    display: flex;
    flex-direction:row;
    align-items: center;
}
.activityImage {
    width: 50%;
    height: 300px;
    background-size: cover;
    background-repeat:no-repeat;
    background-position: center center;
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
    background-color: #c68e5d;
}
#walk {
    background-color: #8e9fae;
}
#workshop {
    background-color: #ffffff;
}
#workshop h1 {
    color: #c68e5d;
}

#beachImage {
    background-image: url('/img/Optimized/sm-P2530978.jpg');
}
#walkImage {
    background-image: url('/img/Optimized/sm-IMGL3380-Edit.jpg');
}
#workshopImage {
    background-image: url('/img/Optimized/sm-P2530978.jpg');
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
        width: 50%;
        height: 50vw;
    }
    .activityTitle {
        width: 50%;
    }
    #beachImage {
    background-image: url('/img/Optimized/lg-P2530978.jpg');
    }
    #walkImage {
        background-image: url('/img/Optimized/lg-IMGL3380-Edit.jpg');
    }
    #workshopImage {
        background-image: url('/img/Optimized/lg-P2530978.jpg');
    }
}


</style>
    
    