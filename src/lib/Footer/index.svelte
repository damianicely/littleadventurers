<script>
</script>

<footer>
	<div>
		<a href="https://www.facebook.com/littleadventurersraposeira">
			<svg height="50px" width="50px" alt="Facebook Icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200"><path d="M0 0v1200h1200V0H0zm863.232 156.592c8.716-.185 17.792.098 27.173.732 34.476.047 70.483 3.155 106.202 6.299l-3.882 142.09h-95.948c-44.988-.996-61.235 16.473-62.695 67.236V484.57h162.525l-6.446 152.198H834.082v423.706h-158.57V636.768H565.43V484.57h110.083V353.906c0-94.21 39.829-154.174 118.286-184.57 20.15-7.928 43.288-12.19 69.433-12.744z"/></svg>
		</a>
		<a href="https://www.facebook.com/littleadventurersraposeira">
			littleadventurers
		</a>
	</div>
	<div>
		<a href="https://www.instagram.com/little__adventurers/">
			<svg height="50px" width="50px" viewBox="0 0 1792 1792" alt="Instagram Icon" xmlns="http://www.w3.org/2000/svg"><path d="M1152 896q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm138 0q0 164-115 279t-279 115-279-115-115-279 115-279 279-115 279 115 115 279zm108-410q0 38-27 65t-65 27-65-27-27-65 27-65 65-27 65 27 27 65zM896 266q-7 0-76.5-.5t-105.5 0-96.5 3-103 10T443 297q-50 20-88 58t-58 88q-11 29-18.5 71.5t-10 103-3 96.5 0 105.5.5 76.5-.5 76.5 0 105.5 3 96.5 10 103T297 1349q20 50 58 88t88 58q29 11 71.5 18.5t103 10 96.5 3 105.5 0 76.5-.5 76.5.5 105.5 0 96.5-3 103-10 71.5-18.5q50-20 88-58t58-88q11-29 18.5-71.5t10-103 3-96.5 0-105.5-.5-76.5.5-76.5 0-105.5-3-96.5-10-103T1495 443q-20-50-58-88t-88-58q-29-11-71.5-18.5t-103-10-96.5-3-105.5 0-76.5.5zm768 630q0 229-5 317-10 208-124 322t-322 124q-88 5-317 5t-317-5q-208-10-322-124t-124-322q-5-88-5-317t5-317q10-208 124-322t322-124q88-5 317-5t317 5q208 10 322 124t124 322q5 88 5 317z"/></svg>
		</a>
		<a href="https://www.instagram.com/little__adventurers/">
			little__adventurers
		</a>
	</div>
	<div>
		<a href="mailto:example@tutorialspark.com">
			<svg height="50px" width="50px" viewBox="0 0 1195 1195" alt="Email Icon" xmlns="http://www.w3.org/2000/svg"><path d="M1109.333 315q-2-25-20.5-42t-43.5-17h-896q-26 0-45 19t-19 45v640q0 26 19 45t45 19h896q26 0 45-19t19-45V315zm-112 5l-400 303-382-303h782zm48 640h-896V349l428 339q19 16 39 1l429-325v596z"/></svg>
		</a>
		<a href="mailto:example@tutorialspark.com">
				katharinablank6@gmail.com
		</a>
	</div>
	<div>
		<svg height="50px" width="50px" viewBox="0 0 1792 1792" alt="Phone Icon" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1240q0 27-10 70.5t-21 68.5q-21 50-122 106-94 51-186 51-27 0-52.5-3.5T1151 1520t-47.5-14.5-55.5-20.5-49-18q-98-35-175-83-128-79-264.5-215.5T344 904q-48-77-83-175-3-9-18-49t-20.5-55.5T208 577t-12.5-57.5T192 467q0-92 51-186 56-101 106-122 25-11 68.5-21t70.5-10q14 0 21 3 18 6 53 76 11 19 30 54t35 63.5 31 53.5q3 4 17.5 25t21.5 35.5 7 28.5q0 20-28.5 50t-62 55-62 53-28.5 46q0 9 5 22.5t8.5 20.5 14 24 11.5 19q76 137 174 235t235 174q2 1 19 11.5t24 14 20.5 8.5 22.5 5q18 0 46-28.5t53-62 55-62 50-28.5q14 0 28.5 7t35.5 21.5 25 17.5q25 15 53.5 31t63.5 35 54 30q70 35 76 53 3 7 3 21z"/></svg>
		<a href="tel:+351925089235">
			+351 925089235
		</a>
	</div>
</footer>

<style>
	footer {
		min-height: 300px;
		background-color: var(--dark-green);
		display: flex;
		flex-direction: column;
		align-items:center;
		justify-content: center;
		font-family: 'Lora', serif;
    	font-style: normal;
		font-weight: 500;

	}
	footer > div {
		width:300px;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	a {
		color:var(--primary-light);
		text-decoration: none;
	}
	svg {
		margin: 0 20px;
		fill: var(--primary-light);
	}
	div:hover svg {
		width:60px;
		height: 60px;
		margin: 0 20px;
		fill: var(--primary-light);
	}
	div:hover a {
		text-decoration: underline;
	}

@media screen and (min-width: 900px) {
	footer {
		flex-direction: row;
		justify-content: center;
	}
	footer > div {
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

}

</style>