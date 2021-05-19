<svelte:head>
	<title>HomePage Little Adventurers!</title>
</svelte:head>

<div class="parallax">

	<div id="group1" class="parallax__group">
		<div class="parallax__layer parallax__layer--base"></div>
		<div class="parallax__layer parallax__layer--fore">
		<div class="title">
			<h1>Little Adventurers</h1>
			<h2>Outdoor activities and creative Workshops for kids in the Algarve Portugal.</h2>
		</div>
		</div>
	</div>

	<div id="group2" class="parallax__group">
		<div class="parallax__layer parallax__layer--base">
      <div class="alternate-title">
        <div class="flex-container">
          <text-block>
            <h2 class="alternate">The Algarve offers the perfect place to go outside and enjoy the beauty of nature. I
            want to combine playing and learning for kids.</h2>
            <h2 class="alternate">Learn how playing outdoors in nature can benefit your children intellectually,
            socially, emotionally, and physically, and discover activities for fostering their development.</h2>
          </text-block>
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
            <img id="blueElephant" src='/img/windows-400.jpg' width="400px" height="467" alt='children playing in different circumstances'>
          </picture>
          </div>
      </div>
		</div>
	</div>

	<div id="group3" class="parallax__group">
		<div class="parallax__layer parallax__layer--base"></div>
		<div class="parallax__layer parallax__layer--fore">
		<div class="title">
			<div></div>
			<h1>Little Adventurers</h1>
			<h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus sequi cupiditate libero, magnam
			adipisci, ut maiores repellat voluptas sit eos praesentium laboriosam rem! Natus vitae porro eligendi
			tempore libero error.</h2>
		</div>
		</div>
	</div>

	<div id="group4" class="parallax__group">
		<div class="parallax__layer parallax__layer--base">
			<div class="title">
				<div class="fullwidth">
				<h2 class="alternate">The Algarve offers the perfect place to go outside and enjoy the beauty of nature. I
					want to combine playing and learning for kids.</h2>
				<h2 class="alternate">Learn how playing outdoors in nature can benefit your children intellectually,
					socially, emotionally, and physically, and discover activities for fostering their development.</h2>
				</div>
				<img src="img/logo_v1.svg" alt="">
			</div>
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
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.alternate-title {
  display: block;
  margin: auto;
  text-align: center;
  max-width: 90vw;
}
.alternate {
  color: rgb(198, 142, 93);
  text-align: justify;
}
/* Parallax base styles
  --------------------------------------------- */
.parallax {
  background-color: #dcd4bc;
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
  z-index: 5;
  /* slide over group 2 */
}
#group1 .parallax__layer--base {
  background-image: url("/img/logBalance-665.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
#group2 {
  z-index: 10;
  /* slide under groups 1 and 3 */
}
#blueElephant {
  padding: 50px 0 50px 0 ;
  height: auto;
  width: 90%;
  max-width: 95vw;
}
#group3 {
  z-index: 11;
  /* slide over group 2 and 4 */
}
#group3 .parallax__layer--base {
  background-image: url("/img/cheek-667.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
#group4 {
  min-height: 800px;
  overflow: hidden;
  z-index: 5;
  /* slide under group 3 and 5 */
}
.flex-container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  min-height: 200px;
}
@media screen and (min-width: 780px) {
	#group1 .parallax__layer--base {
		background-image: url("/img/kiss-1000.jpg");
	}
  #group3 .parallax__layer--base {
		background-image: url("/img/kiss-1000.jpg");
	}

  #blueElephant {
    padding: 50px;
    width: 40vw;
    max-width: 500px;
  }
  .flex-container {
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
        -ms-flex-direction: row-reverse;
            flex-direction: row-reverse;
    align-items: center;
    justify-content: space-around;
  }
  .alternate-title {
    width: 70vw;
    max-width: 1000px;
  }
}

/*# sourceMappingURL=app.css.map */
</style>