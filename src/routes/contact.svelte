<svelte:head>
	<title>Contact Page</title>
</svelte:head>


<picture>
    <source type="image/avif" srcset='/img/contactsmall-800.avif 665w' media="(max-width: 1000px)" sizes='100vw'>
    <source type="image/jpg" srcset='/img/contactsmall-800.jpg 665w' media="(max-width: 1000px)" sizes='100vw'>
    <source type="image/avif" srcset='
                                    /img/contactbig-1000.avif 1000w,
                                    /img/contactbig-1200.avif 1200w,
                                    /img/contactbig-1400.avif 1400w,
                                    /img/contactbig-1600.avif 1600w,
                                    /img/contactbig-1800.avif 1800w,
                                    /img/contactbig-2000.avif 2000w,' media="(min-width: 1000px)" sizes='100vw'>
    <source type="image/jpg" srcset='
                                    /img/contactbig-1000.jpg 1000w,
                                    /img/contactbig-1200.jpg 1200w,
                                    /img/contactbig-1400.jpg 1400w,
                                    /img/contactbig-1600.jpg 1600w,
                                    /img/contactbig-1800.jpg 1800w,
                                    /img/contactbig-2000.jpg 2000w,' media="(min-width: 1000px)" sizes='100vw'>
    <img src='/img/contactsmall-800.jpg' width="100vw" height="100%" alt='vortex of leaves blown around smiling child'>
</picture>
<div class="title">
    <h1>
        Please use any of the methods in the footer below to contact me.
    </h1>
</div>
<style>
    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
    .title {
        text-align: center;
        position: absolute;
        left: 50%;
        top: 30%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    h1 {
        font-size: 2em;
    }

    @media(min-width:1000px){
        .title {
            top: 60%;
        }
        h1 {
            font-size: 3.5em;
        }
    }
    
</style>    