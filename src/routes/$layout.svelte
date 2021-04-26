<script>
	import '../app.css';
</script>


<nav>

	<a href="."><img id="logo" src="img/logo_v1.svg" alt=""></a>
	<div>

		<div class="responsiveicons">
		<a href="#menuItems">
			<svg id="hamburger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none"
			stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="5">
			<path d="M4 8 L28 8 M4 16 L28 16 M4 24 L28 24" />
			</svg>
		</a>
		</div>

		<ul id="menuItems">
		<li><a href=".">Home</a></li>
		<li id="menuFix"><a href="activities">Activities </a></li>
		<li><a href="about"> About</a></li>
		<li><a href="contact">Contact</a></li>
		<li><a href="blog">Blog</a></li>
		<li id="close"><a href="#top"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32"
				fill="none" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
				<path d="M30 20 L16 8 2 20" />
			</svg> </a></li>
		</ul>

	</div>
	
</nav>
	
<style>
#logo {
  height: 110px;
}

#menuItems {
  display: none;
}

@media screen and (min-width: 900px) {
  #menuItems {
    display: inline-block;
    list-style-type: none;
  }
    #logo {
    height: 150px;
  }
}
#menuItems li {
  display: inline-block;
  width: 100%;
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}

@media screen and (min-width: 900px) {
  #menuItems li {
    width: 80px;
  }
  li+#menuFix {
    width: 120px;
  }
}

#menuItems li:hover {
  background-color: #c68e5d;
}

@media screen and (min-width: 900px) {
  #menuItems li:hover {
    background-color: #dcd4bc;
  }
}

#close {
  display: none;
}

@media screen and (min-width: 900px) {
  #close {
    visibility: hidden;
  }
}

@media screen and (min-width: 900px) {
  #hamburger {
    display: none;
  }
}

nav {
  background-color: #dcd4bc;
  position: absolute;
  z-index: 10;
  top: 0;
  width: 100%;
  padding-top: 10px;
  height: 60px;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr (170px);
      grid-template-columns: 1fr repeat(1, 200px);
  grid-gap: 40px;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  justify-items: center;
  list-style-type: none;
}

@media screen and (min-width: 900px) {
  nav {
    -ms-grid-columns: 200px 1fr;
        grid-template-columns: 200px 1fr;
  }
}

nav :first-child {
  -ms-grid-column-align: left;
      justify-self: left;
}

nav a {
  color: white;
  font-family: Bodoni, Arial, Helvetica, sans-serif;
  font-size: calc(1.3em + 0.5vh);
  font-weight: 600;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

#menuItems:target {
  display: block;
  background-color: #dcd4bc;
}
</style>

<slot />
