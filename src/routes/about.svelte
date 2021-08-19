<svelte:head>
	<title>About Page</title>
</svelte:head>
<div id="about">

    <div id="portrait">
        <picture>
            <source type="image/avif" srcset='
                        /img/Optimized/kata1-600.avif 600w
                        /img/Optimized/kata1-800.avif 800w
                        /img/Optimized/kata1-1000.avif 1000w
                        /img/Optimized/kata1-1200.avif 1200w' media="(max-width: 1200px)" sizes='100vw'>
            <source type="image/jpg" srcset='
                        /img/Optimized/kata1-600.jpg 600w
                        /img/Optimized/kata1-800.jpg 800w
                        /img/Optimized/kata1-1000.jpg 1000w
                        /img/Optimized/kata1-1200.jpg 1200w' media="(max-width: 1200px)" sizes='100vw'>
            <source type="image/avif" srcset='
                                            /img/Optimized/kata2-1400.avif 1400w,
                                            /img/Optimized/kata2-1600.avif 1600w,
                                            /img/Optimized/kata2-1800.avif 1800w,
                                            /img/Optimized/kata2-2000.avif 2000w,
                                            /img/Optimized/kata2-2200.avif 2200w,
                                            /img/Optimized/kata2-2400.avif 2400w,' media="(min-width: 1200px)" sizes='65vw'>
            <source type="image/jpg" srcset='
                                            /img/Optimized/kata2-1400.jpg 1400w,
                                            /img/Optimized/kata2-1600.jpg 1600w,
                                            /img/Optimized/kata2-1800.jpg 1800w,
                                            /img/Optimized/kata2-2000.jpg 2000w,
                                            /img/Optimized/kata2-2200.jpg 2200w,
                                            /img/Optimized/kata2-2400.jpg 2400w,' media="(min-width: 1200px)" sizes='65vw'>
            <img src='/img/Optimized/kata1.jpg' width="100vw" height="100%" alt='Kata smiling and looking down'>
        </picture>
    </div>

    <div id="aboutKata">
        <h1 class="alternate">Katharina</h1>
        <p class="subheading">Child Development Specialist - Activity coordinator</p>
        <p> I have always been a lover of sports and    nature. Especially surfing which combines that.
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

<style>

#about {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 400px;
    max-width: 300vh;
    align-items: center;
    background-color: ivory;
}
#portrait {
    width: 100%;
}
#aboutKata {
    width: 90%;
    overflow: auto;
    margin: var(--section-gap)
}
#portrait img {
    object-fit: cover;
    width: 100%
}
@media screen and (min-width: 1200px) {
    #about {
        flex-direction: row;
        align-items: flex-start;
    }
    #portrait {
        width: 65vw;
    }
    #aboutKata {
        width: 35vw;
    }
}

h1 {
    margin-top: 50px;
    padding-left: 30px;
    font-size: 2.5em;
}
@media screen and (min-width: 1000px) {
  h1 {
    font-size: 4em;
  }
}
@media screen and (min-width: 1700px) {
  h1 {
    font-size: 6em;
  }
}

p {
    padding:10px 15px 10px 30px;
}



</style>
    
    