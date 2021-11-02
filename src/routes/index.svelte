<svelte:head>
	<title>HomePage Little Adventurers!</title>
</svelte:head>

<div id="group1" class="parallax__group">
  <div class="parallax__layer parallax__layer--base">
    <picture>
      <source type="image/avif" srcset='/img/logBalance-665.avif 665w' media="(max-width: 1000px)" sizes='100vw'>
      <source type="image/jpg" srcset='/img/logBalance-665.jpg 665w' media="(max-width: 1000px)" sizes='100vw'>
      <source type="image/avif" srcset='
                                      /img/walkOnBeachO-1000.avif 1000w,
                                      /img/walkOnBeachO-1200.avif 1200w,
                                      /img/walkOnBeachO-1400.avif 1400w,
                                      /img/walkOnBeachO-1600.avif 1600w,
                                      /img/walkOnBeachO-1800.avif 1800w,
                                      /img/walkOnBeachO-2000.avif 2000w,' media="(min-width: 1000px)" sizes='100vw'>
      <source type="image/jpg" srcset='
                                      /img/walkOnBeachO-1000.jpg 1000w,
                                      /img/walkOnBeachO-1200.jpg 1200w,
                                      /img/walkOnBeachO-1400.jpg 1400w,
                                      /img/walkOnBeachO-1600.jpg 1600w,
                                      /img/walkOnBeachO-1800.jpg 1800w,
                                      /img/walkOnBeachO-2000.jpg 2000w,' media="(min-width: 1000px)" sizes='100vw'>
      <img src='/img/logBalance-665.jpg' width="100vw" height="100%" alt='vortex of leaves blown around smiling child'>
    </picture>
  </div>
  <div class="parallax__layer parallax__layer--fore">
    <div class="title">
      <h1>Little Adventurers</h1>
      <a href="/contact"><button>Book Now</button></a>
      <h2>Outdoor activities and creative Workshops for kids in the Algarve Portugal.<br>Created from the love of working with kids.</h2>
    </div>
  </div>
</div>

<div id="group2">
  <div>
    <h2 class="alternate">The Algarve offers the perfect place to go outside and enjoy the beauty of nature. I love to combine playing and learning for children.</h2>
    <h2 class="alternate">Learn how playing outdoors in nature can benefit your children intellectually,
    socially, emotionally, and physically, and discover activities for fostering their development.</h2>
  </div>
  <picture>
    <source type="image/avif"
      srcset='
      /img/windows-1000.avif 1000w,
      /img/windows-800.avif 800w,
      /img/windows-600.avif 600w,
      /img/windows-400.avif 400w,'
      sizes='(min-width: 500px) 700px, 100vw'>
    <source type="image/jpg"
      srcset='
      /img/windows-1000.jpg 1000w,
      /img/windows-800.jpg 800w,
      /img/windows-600.jpg 600w,
      /img/windows-400.jpg 400w,'
      sizes='(min-width: 500px) 700px, 100vw'>
    <img src='/img/windows-400.jpg' width="400px" height="467" alt='children playing in different circumstances'>
  </picture>
</div>

<div id="group3">
  <picture>
    <source type="image/avif" srcset='/img/cheek-667.avif 665w' media="(max-width: 700px)" sizes='100vw'>
    <source type="image/jpg" srcset='/img/cheek-667.jpg 665w' media="(max-width: 700px)" sizes='100vw'>
    <source type="image/avif" srcset='
                                    /img/kiss-1000.avif 1000w' media="(min-width: 700px)" sizes='100vw'>
    <source type="image/jpg" srcset='
                                    /img/kiss-1000.jpg 1000w' media="(min-width: 700px)" sizes='100vw'>
    <img src='/img/cheek-667.jpg' width="100vw" height="100%" alt='vortex of leaves blown around smiling child'>
  </picture>
</div>

<div id="group4">
  <div class="half">
    <div class="quater">
      <h2 class="alternate">I believe each child is a unique "being" that learns and sprouts in creative settings, where they can embrace ideas and reveal their unlimited potential.
        </h2>
      <h2 class="alternate">Children should develop freely in nature, playing and discovering together.</h2>
    </div>
    <div class="quater">
      <picture>
        <source type="image/avif"srcset='/img/dandylion-400.avif 400w' sizes='400px'>
        <source type="image/jpg"srcset='/img/dandylion-400.jpg 400w' sizes='400px'>
        <img src='/img/dandylion-400.jpg' width="400px" height="400px" alt='two children climbing a tree'>
      </picture>
    </div>
  </div>
  <div class="half">
    <div class="quater">
      <h2 class="alternate">Learning through exercise outdoors is main motor for cognitive development
        In the early years it is about configuring imaginations, there is no creative 'wrong'.
        </h2>
      <h2 class="alternate">I want each child to see the beauty, light, forms and patterns in everyday objects.</h2>
    </div>
    <div class="quater">
      <picture>
        <source type="image/avif"srcset='/img/watering-400.avif 400w' sizes='400px'>
        <source type="image/jpg"srcset='/img/watering-400.jpg 400w' sizes='400px'>
        <img src='/img/watering-400.jpg' width="400px" height="400px" alt='vortex of leaves blown around smiling child'>
      </picture>
    </div>
  
  </div>
</div>

<style>
/* centre the content in the parallax layers */
.title {
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -30%);
  transform: translate(-50%, -30%);
}
.title h1{
  margin-bottom: 20px;
}
.title h2{
  margin-top: 40px;
  color: white;
  font-weight: bolder;
  font-size: 2rem;
}
/* Parallax base styles
  --------------------------------------------- */

.parallax__group {
  position: relative;
  height: 500px;
  /* fallback for older browsers */
  height: 90vh;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

.parallax__layer {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transform-origin-x: 100%;
  -ms-transform-origin-x: 100%;
}

.parallax__layer--fore {
  -webkit-transform: translateZ(90px) scale(0.7);
  transform: translateZ(90px) scale(0.7);
  z-index: 1;
}

.parallax__layer--base {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  z-index: 4;
}

/* style the groups
  --------------------------------------------- */
#group1 {
  margin-top: 10px;
  z-index: 5;
  /* slide over group 2 */
}
#group1 img{
  object-fit: cover;
  height: 100%;
  width:100%;
}
button {
  font-family: 'ClaudeSansPlain-Regular', serif;
  font-style: normal;
  font-weight: 700;
  font-size: 1.5em;
  border: 3px solid var(--primary-light);
  padding: 15px 30px;
  color: var(--primary-light);
  background-color: var(--primary-dark);
  transition-duration: 0.4s;
}
button:hover {
  color: oldlace;
  background-color: var(--primary-dark);
  text-decoration: underline;
}

#group2 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: 700px;
  margin: var(--section-gap) 0;
  z-index: 10;
  position: relative;

  /* slide under groups 1 and 3 */
}
#group2 > div {
  padding: 50px;
  width: clamp(400px, 700px, 1000px);
}
#group2 img {
  padding: 50px;
  height: auto;
  width: 400px;
}
#group3 {
  height: 700px;
  /* fallback for older browsers */
}
#group3 img {
  object-fit: cover;
  width: 100%;
  height: 700px;
}
#group4 {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  min-height: 700px;
  justify-content: center;
  align-content: center;
  margin: var(--section-gap) 0;
}
div.half {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 840px;
  justify-content: center;
}
div.quater {
  width: clamp(200px, 400px, 100vw);
  padding: 10px;
}


/*# sourceMappingURL=app.css.map */
</style>