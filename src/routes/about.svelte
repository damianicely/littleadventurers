<svelte:head>
	<title>About Page</title>
</svelte:head>

<main>

    <div id="about">

        <div id="portrait">
        </div>

        <div id="aboutKata">
            <h1>Katarina</h1>
            <p class="subheading">Child Development Specialist | Activity coordinator</p>
            <p> I have always been a lover of sports and nature. Especially surfing which combines that.
            I started as a young teenager working with kids (babysitting, kindergarten) and that was the moment I found out
            that I love working with kids.</p>

            <p> In Germany, my first official training was within the 'social assistant' care field, I then proceeded to work
            and gain experience in many different kindergartens and learnt a lot about children's behaviour and learning
            environments.</p>

            <p> After that I went to University in Germany and studied Educational science. During my studies I was working in
            a Montessori school and realised that I like to combine sports / outdoor activities with working with children. I
            involved myself and initiated many different sports nature projects within my time there and really found a
            passion for this field of work.</p>

            <p> Upon successfully completing my Bachelor degree in 2013, my thesis for my final year was titled, "The Meaning
            of Movement in Childhood" just to give you some insight to my passion for this subject, was well received and
            really put a stamp on me to follow my passion for this field of education.</p>

            <p> After graduating from a sports degree at University in Germany I was drawn to Portugal to work for 2 months in
            a surf camp. From there it was an easy decision as i fell in love with the country, natural beauty, the local
            culture, lifestyle and decided to stay. The South Western region has been my home for 6 years now, specifically
            Sagres and Raposeira.</p>
        </div>

    </div>
    
</main>

<style>

#about {
    background-color: rgb(220, 212, 188);;
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 400px;
    max-width: 300vh;
    align-items: center;
}
#portrait {
    width: 100%;
    height: 100vw;
    background-image: url('/img/portrait.jpg');
    background-size: cover;
    background-repeat:no-repeat;
    background-position: center center;
}
#aboutKata {
    width: 90%;
    overflow: auto;
}

#aboutKata p {
    padding:10px 15px 10px 15px;
}
@media screen and (min-width: 780px) {
    #about {
        flex-direction: row;
    }
    #portrait {
        width: 65vw;
        height: 65vw;
    }
    #aboutKata {
        width: 35vw;
    }
}


</style>
    
    