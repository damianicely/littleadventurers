<nav id="hamnav">
    <img id="logo" src="/logo_v1.svg" alt="">

    <!-- [THE HAMBURGER] -->
    <label for="hamburger">
      <svg viewBox="0 0 100 80" width="40" height="40">
        <defs>
          <style>
            .hamburger{fill:rgb(198, 142, 93)}
          </style>
        </defs>
        <rect class="hamburger" width="100" height="20"></rect>
        <rect class="hamburger"y="30" width="100" height="20"></rect>
        <rect class="hamburger" y="60" width="100" height="20"></rect>
      </svg>
      </label>  
    </label>
    <input type="checkbox" id="hamburger"/>
  <!-- [MENU ITEMS] -->
  <div id="hamitems">
    <a href="index.html/#">Home</a>
    <a href="about.html/#">About</a>
    <a href="tech.html/#">Tech</a>
    <a href="games.html/#">Games</a>
    <a href="reviews.html/#">Reviews</a>
  </div>
</nav>

<style>
  /* [DOES NOT MATTER] */
html, body {
  padding: 0;
  margin: 0;
  font-family: arial, sans-serif;
  overflow: hidden;
  background-color: #c68e5d;
}

/* [ON BIG SCREENS] */
nav {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  background-color: transparent;
}

/* Wrapper */
#hamnav {
  width: 100%;
  background: #dcd4bc;
  /* Optional */
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

#logo {
  height: 110px;
  z-index: 100;
  overflow: visible;
}

/* Hide Hamburger */
#hamnav label, #hamburger {
  display: none;
}

/* Horizontal Menu Items */
#hamitems {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

#hamitems a {
  width: 100px;
  /* 100% / 5 tabs = 20% */
  padding: 10px;
  color: white;
  text-decoration: none;
  text-align: center;
}

#hamitems a:hover {
  background: #c68e5d;
}

/* [ON SMALL SCREENS] */
@media screen and (max-width: 768px) {
  /* Show Hamburger Icon */
  nav {
    display: block;
  }
  #hamnav label {
    display: inline-block;
    float: right;
    color: white;
    padding: 20px;
  }
  /* Break down menu items into vertical */
  #hamitems a {
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    display: block;
    width: 100%;
    border-top: 1px solid #333;
  }
  /* Toggle Show/Hide Menu */
  #hamitems {
    display: none;
  }
  #hamnav input:checked ~ #hamitems {
    display: block;
  }
}
/*# sourceMappingURL=ham-menu.css.map */
</style>