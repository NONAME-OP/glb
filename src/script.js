/////////////////////////////////////////////////////////////////////////
///// IMPORT
import './main.css'
import { Clock, Scene, LoadingManager, WebGLRenderer, sRGBEncoding, Group, PerspectiveCamera, DirectionalLight, PointLight, MeshPhongMaterial, AnimationMixer } from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLBufferAttribute } from 'three/src/Three.Core.js'

/////////////////////////////////////////////////////////////////////////
//// LOADING SCREEN ELEMENTS
const loadingScreen = document.getElementById('loading-screen')
const loadingStatus = document.getElementById('loading-status')
const progressBar = document.getElementById('progress-bar')
const progressText = document.getElementById('progress-text')
const continueBtn = document.getElementById('continue-btn')
const startExperienceBtn = document.getElementById('start-experience-btn')
const mainContainer = document.querySelector('.main-container')
const loadingVideo = document.getElementById('loading-video-bg')

// Handle video audio and autoplay
if (loadingVideo) {
    // Try to play video with sound
    loadingVideo.play().catch(function(error) {
        console.log('Video autoplay failed:', error)
        // Show a message to user to click to enable sound
        const audioPrompt = document.createElement('div')
        audioPrompt.className = 'audio-prompt'
        audioPrompt.textContent = '🔇 Click to enable sound'
        audioPrompt.onclick = function() {
            loadingVideo.muted = false
            loadingVideo.play()
            this.remove()
        }
        loadingScreen.appendChild(audioPrompt)
    })
    
    // Ensure video is not muted
    loadingVideo.muted = false
    
    // Add event listener for when video can play
    loadingVideo.addEventListener('canplay', function() {
        this.muted = false
        this.volume = 0.7 // Set volume to 70%
    })
    
    // Handle video errors
    loadingVideo.addEventListener('error', function() {
        console.log('Video loading error:', this.error)
    })
}

// Handle continue button click
continueBtn.addEventListener('click', function() {
    // Stop video and audio
    if (loadingVideo) {
        loadingVideo.pause()
        loadingVideo.currentTime = 0
        loadingVideo.muted = true
    }
    
    // Stop any other audio that might be playing
    const allVideos = document.querySelectorAll('video')
    allVideos.forEach(video => {
        video.pause()
        video.muted = true
    })
    
    const allAudios = document.querySelectorAll('audio')
    allAudios.forEach(audio => {
        audio.pause()
        audio.muted = true
    })
    
    // Fade out loading screen
    loadingScreen.style.transition = 'all 0.8s ease-in-out'
    loadingScreen.style.opacity = '0'
    loadingScreen.style.transform = 'scale(0.9)'
    
    setTimeout(() => {
        loadingScreen.style.display = 'none'
        
        // Show main content
        mainContainer.style.visibility = 'visible'
        mainContainer.style.opacity = '0'
        mainContainer.style.transform = 'translateY(30px)'
        mainContainer.style.transition = 'all 0.8s ease-in-out'
        
        setTimeout(() => {
            mainContainer.style.opacity = '1'
            mainContainer.style.transform = 'translateY(0)'
        }, 100)
        
        document.querySelector("body").style.overflow = 'auto'
        
        // Trigger intro animation
        introAnimation()
        
        // Remove old loading elements
        const ftsLoader = document.querySelector(".lds-roller")
        const looadingCover = document.getElementById("loading-text-intro")
        if (ftsLoader) ftsLoader.parentNode.removeChild(ftsLoader)
        if (looadingCover) looadingCover.parentNode.removeChild(looadingCover)
        
        window.scroll(0, 0)
    }, 800)
})

// Handle Start Experience button click
startExperienceBtn.addEventListener('click', function() {
    // Stop video and audio
    if (loadingVideo) {
        loadingVideo.pause()
        loadingVideo.currentTime = 0
        loadingVideo.muted = true
    }
    
    // Stop any other audio that might be playing
    const allVideos = document.querySelectorAll('video')
    allVideos.forEach(video => {
        video.pause()
        video.muted = true
    })
    
    const allAudios = document.querySelectorAll('audio')
    allAudios.forEach(audio => {
        audio.pause()
        audio.muted = true
    })
    
    // Trigger screen glitch effect
    const loadingScreen = document.getElementById('loading-screen')
    if (loadingScreen) {
        loadingScreen.classList.add('screen-glitch')
    }
    
    // Wait for glitch animation to complete before transitioning
    setTimeout(() => {
        // Fade out loading screen
        loadingScreen.style.transition = 'all 0.8s ease-in-out'
        loadingScreen.style.opacity = '0'
        loadingScreen.style.transform = 'scale(0.9)'
        
        setTimeout(() => {
            loadingScreen.style.display = 'none'
            
            // Show main content
            mainContainer.style.visibility = 'visible'
            mainContainer.style.opacity = '0'
            mainContainer.style.transform = 'translateY(30px)'
            mainContainer.style.transition = 'all 0.8s ease-in-out'
            
            setTimeout(() => {
                mainContainer.style.opacity = '1'
                mainContainer.style.transform = 'translateY(0)'
            }, 100)
            
            document.querySelector("body").style.overflow = 'auto'
            
            // Trigger intro animation
            introAnimation()
            
            // Remove old loading elements
            const ftsLoader = document.querySelector(".lds-roller")
            const looadingCover = document.getElementById("loading-text-intro")
            if (ftsLoader) ftsLoader.parentNode.removeChild(ftsLoader)
            if (looadingCover) looadingCover.parentNode.removeChild(looadingCover)
            
            window.scroll(0, 0)
        }, 800)
    }, 3000) // Wait for 3 seconds for glitch animation to complete
})

/////////////////////////////////////////////////////////////////////////
//// LOADING MANAGER
const ftsLoader = document.querySelector(".lds-roller")
const looadingCover = document.getElementById("loading-text-intro")
const loadingManager = new LoadingManager()

loadingManager.onStart = function(url, itemsLoaded, itemsTotal) {
    console.log('Started loading:', url, itemsLoaded, itemsTotal)
    
    loadingStatus.textContent = 'Starting to load 3D model...'
}

// Show loading progress
loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
    const progress = (itemsLoaded / itemsTotal) * 100
    const progressBar = document.getElementById('progress-bar')
    const progressText = document.getElementById('progress-text')
    
    // Update progress bar width
    if (progressBar) {
        progressBar.style.width = progress + '%'
    }
    
    // Update loading status text
    loadingStatus.textContent = `Loading... ${Math.round(progress)}%`
    
    // Show Start Experience button when loading is 100% complete
    if (progress >= 100) {
        loadingStatus.textContent = 'Starting to load 3D model...'

        setTimeout(() => {
            startExperienceBtn.style.display = 'block'

            startExperienceBtn.style.display = 'block'
            startExperienceBtn.style.opacity = '1'
            startExperienceBtn.style.transform = 'translateY(0) scale(1)'
           
        }, 500) 
        // Small delay for smooth appearance
    }   

}

loadingManager.onLoad = function() {
    // Hide loading elements
   
    loadingStatus.textContent = `GET READY TO ENTER THE EXPERIENCE...`
    // Show Start Experience button with entrance animation
    setTimeout(() => {
        startExperienceBtn.style.display = 'block'
        startExperienceBtn.style.opacity = '1'
        startExperienceBtn.style.transform = 'translateY(0) scale(1)'
        startExperienceBtn.classList.add('attention')
    }, 1000)
}

loadingManager.onError = function(url) {
    console.error('Error loading:', url)
    loadingStatus.textContent = 'Error loading 3D model. Please refresh the page.'
    progressBar.style.background = '#ff4444'
}

/////////////////////////////////////////////////////////////////////////
//// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
dracoLoader.setDecoderConfig({ type: 'js' })
const loader = new GLTFLoader(loadingManager)
loader.setDRACOLoader(dracoLoader)

/////////////////////////////////////////////////////////////////////////
///// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.getElementById('canvas-container')
const containerDetails = document.getElementById('canvas-container-details')

/////////////////////////////////////////////////////////////////////////
///// GENERAL VARIABLES
let oldMaterial
let secondContainer = false
let width = container.clientWidth
let height = container.clientHeight
let mixer = null // Animation mixer for GLB animations
let currentAudio = null;

/////////////////////////////////////////////////////////////////////////
///// SCENE CREATION
const scene = new Scene()

/////////////////////////////////////////////////////////////////////////
///// RENDERER CONFIG
const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance"})
renderer.autoClear = true
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
renderer.setSize( width, height)
renderer.outputEncoding = sRGBEncoding
container.appendChild(renderer.domElement)

const renderer2 = new WebGLRenderer({ antialias: false})
renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
renderer2.setSize( width, height)
renderer2.outputEncoding = sRGBEncoding
containerDetails.appendChild(renderer2.domElement)

/////////////////////////////////////////////////////////////////////////
///// CAMERAS CONFIG
const cameraGroup = new Group()
scene.add(cameraGroup)

const camera = new PerspectiveCamera(35, width / height, 1, 100)
camera.position.set(19,1.54,-0.1)
cameraGroup.add(camera)

const camera2 = new PerspectiveCamera(35, containerDetails.clientWidth / containerDetails.clientHeight, 1, 100)
camera2.position.set(1.9,2.7,2.7)
camera2.rotation.set(0,1.1,0)
scene.add(camera2)

/////////////////////////////////////////////////////////////////////////
///// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    
    camera2.aspect = containerDetails.clientWidth / containerDetails.clientHeight
    camera2.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer2.setSize(containerDetails.clientWidth, containerDetails.clientHeight)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
    renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1))
})

/////////////////////////////////////////////////////////////////////////
///// SCENE LIGHTS
const sunLight = new DirectionalLight(0x435c72, 0.08)
sunLight.position.set(-200,0,-200)
scene.add(sunLight)

const fillLight = new PointLight(0x88b2d9, 25.0, 8, 8.5) 
fillLight.position.set(0, 3, 0)
scene.add(fillLight)

/////////////////////////////////////////////////////////////////////////
///// LOADING GLB/GLTF MODEL FROM BLENDER
const MODEL_URLS = {
    primary: 'https://github.com/NONAME-OP/glb/releases/download/untagged-c4b11e042fa9012007ab/graces-draco2.glb',
    fallback: 'https://github.com/NONAME-OP/glb/releases/download/untagged-c4b11e042fa9012007ab/graces-draco2.glb' // Keep local as fallback
};

function loadModel(url, isRetry = false) {
    loader.load(url, function (gltf) {
        console.log('GLB loaded successfully from:', url);
        console.log('Animations in GLB:', gltf.animations);
        
        gltf.scene.traverse((obj) => {
            if (obj.isMesh) {
                if (obj.material && obj.material.shininess !== undefined) {
                    obj.material.shininess = 45;
                }
            }
        });
        scene.add(gltf.scene);
        
        if (gltf.animations && gltf.animations.length > 0) {
            console.log('🎬 Found animations in GLB file!');
            mixer = new AnimationMixer(gltf.scene);
            
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                action.play();
                console.log(`Playing animation: ${clip.name}, duration: ${clip.duration}s`);
            });
            
            console.log(`Loaded ${gltf.animations.length} animation(s):`, gltf.animations.map(clip => clip.name));
        } else {
            console.log('No animations found in the GLB file');
            console.log('Adding test rotation animation...');
            gltf.scene.rotation.y = 0;
            
            const rotationTween = new TWEEN.Tween(gltf.scene.rotation)
                .to({ y: Math.PI * 2 }, 5000)
                .repeat(Infinity)
                .easing(TWEEN.Easing.Linear.None)
                .start();
        }
    }, function (progress) {
        console.log('Loading progress from', url + ':', (progress.loaded / progress.total * 100) + '%');
    }, function (error) {
        console.error('Error loading GLB from', url + ':', error);
        
        // Try fallback URL if primary fails
        if (!isRetry && url === MODEL_URLS.primary) {
            console.log('Trying fallback URL...');
            loadModel(MODEL_URLS.fallback, true);
        } else {
            loadingStatus.textContent = 'Error loading 3D model. Please refresh the page.';
            progressBar.style.background = '#ff4444';
        }
    });
}

// Start loading with primary URL
loadModel(MODEL_URLS.primary);

function clearScene(){
    oldMaterial.dispose()
    renderer.renderLists.dispose()
}

/////////////////////////////////////////////////////////////////////////

function introAnimation() {
    new TWEEN.Tween(camera.position.set(0,5000,2.7)).to({ x: 0, y: 2.4, z: 8.8}, 3500).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
        document.querySelector('.header').classList.add('ended')
        document.querySelector('.first>p').classList.add('ended')
    })
    
}
GLBufferAttribute

//////////////////////////////////////////////////
//// CLICK LISTENERS
document.getElementById('aglaea').addEventListener('click', () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    document.getElementById('aglaea').classList.add('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('SAI').classList.remove('active')
    document.getElementById('KI').classList.remove('active')
    document.getElementById('RAN').classList.remove('active')
    document.getElementById('sh').classList.remove('active')
    document.getElementById('content').innerHTML = 'HE IS THE MOST UNDISPUTED CODER OF ALL TIME WITH NO ONE TO DETHRONE HIM FROM THE POSITION HE IS IN'
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = `
<h2 class="subheading">
    With expertise across these software tools, we bring creative and effective solutions to a wide range of platforms.
</h2>
        <div class="social-links">
		<div id="twitter" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/md-kaif-16306b253/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775
                     1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195
                     -.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045
                     -4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574
                     -.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89
                     -.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419
                     -2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212
                     9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z">
            </path>
        </svg>
        <span>x/kaif</span>
    </a>
</div>
	<div id="linkedin" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/md-kaif-16306b253/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
        </svg>
        <span>in/KAIF</span>
    </a>
</div>

		<div id="github" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/md-kaif-16306b253/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 
                     0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234
                     c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756
                     -1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237
                     1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604
                     -2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221
                     -.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23
                     .957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404
                     2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176
                     .77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921
                     .43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576
                     4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
    </a>
</div>
    `;
    animateCamera({ x: 1.0, y: 0.5, z: 1.9 },{ x:0,z:0,y: -0.1 })//ANIMATE CAMERA
    currentAudio = new Audio('https://github.com/user-attachments/files/23751350/kk.mp3');
    currentAudio.play();
})

//V
document.getElementById('thalia').addEventListener('click', () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    document.getElementById('thalia').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('SAI').classList.remove('active')
    document.getElementById('KI').classList.remove('active')
    document.getElementById('RAN').classList.remove('active')
    document.getElementById('sh').classList.remove('active')

    document.getElementById('content').innerHTML = 'THE LEADER OF THE UNVIERSE WHO IS TALENTED AND SKILLED IN WEB TECHNOLOGIES'
     const contentEl = document.getElementById('content');
    contentEl.innerHTML = `
    <h2 class="subheading">
    With expertise across these software tools, we bring creative and effective solutions to a wide range of platforms.
</h2>
        <div class="social-links">
		<div id="twitter" class="social-btn flex-center">
    <a href="https://x.com/lord_explosion2" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775
                     1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195
                     -.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045
                     -4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574
                     -.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89
                     -.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419
                     -2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212
                     9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z">
            </path>
        </svg>
        <span>x/venu</span>
    </a>
</div>
	<div id="linkedin" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/venu-prasad-551b09340/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
        </svg>
        <span>in/venu</span>
    </a>
</div>

		<div id="github" class="social-btn flex-center">
    <a href="https://github.com/vinsmokejazz" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 
                     0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234
                     c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756
                     -1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237
                     1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604
                     -2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221
                     -.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23
                     .957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404
                     2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176
                     .77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921
                     .43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576
                     4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
    </a>
</div>
    `;
    animateCamera({ x: 3.6, y: 3.3, z: 2.7 },{x:0,z:0, y: -0.1 })
    currentAudio = new Audio('https://github.com/user-attachments/files/23751376/vinbat.mp3');
    currentAudio.play();
})

//J
document.getElementById('euphre').addEventListener('click', () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    document.getElementById('euphre').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('SAI').classList.remove('active')
    document.getElementById('KI').classList.remove('active')
    document.getElementById('RAN').classList.remove('active')
    document.getElementById('sh').classList.remove('active')
    document.getElementById('content').innerHTML = 'THE GOD OF AI CREATION WHO WITHNESED THE BIRTH OF AI IN HIS WORK WHICH THEN BLOOM THE WHOLE WORLD'
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = `
    <h2 class="subheading">
    With expertise across these software tools, we bring creative and effective solutions to a wide range of platforms.
</h2>
        <div class="social-links">
		<div id="twitter" class="social-btn flex-center">
    <a href="https://x.com/shrisha_joshi13" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775
                     1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195
                     -.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045
                     -4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574
                     -.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89
                     -.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419
                     -2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212
                     9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z">
            </path>
        </svg>
        <span>x/joshi</span>
    </a>
</div>
	<div id="linkedin" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/shrisha-joshi/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
        </svg>
        <span>in/joshi</span>
    </a>
</div>

		<div id="github" class="social-btn flex-center">
    <a href="https://github.com/shrisha-joshi" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 
                     0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234
                     c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756
                     -1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237
                     1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604
                     -2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221
                     -.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23
                     .957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404
                     2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176
                     .77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921
                     .43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576
                     4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
    </a>
</div>
    `;
    animateCamera({ x: -2.4, y: 0.4, z: -0.4 },{x:0,z:0, y: -0.1 })
    currentAudio = new Audio('https://github.com/user-attachments/files/23751366/josi.mp3');
    currentAudio.play();
})

//ZAYA
document.getElementById('SAI').addEventListener('click', () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    document.getElementById('SAI').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('KI').classList.remove('active')
    document.getElementById('RAN').classList.remove('active')
    document.getElementById('sh').classList.remove('active')
    document.getElementById('content').innerHTML = 'THE SELF PROCLAIMED FATHER OF NOTHING JUST ROMING AS HIS FUTURE IS DESTINED IN TALKING OVER HIS FAMILY BUSINESS IN DHUBAI'
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = `
    <h2 class="subheading">
    With expertise across these software tools, we bring creative and effective solutions to a wide range of platforms.
</h2>
        <div class="social-links">
		<div id="twitter" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/mahmood-zayaan-khan-676b45358/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775
                     1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195
                     -.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045
                     -4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574
                     -.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89
                     -.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419
                     -2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212
                     9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z">
            </path>
        </svg>
        <span>x/zayaan</span>
    </a>
</div>
	<div id="linkedin" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/mahmood-zayaan-khan-676b45358/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
        </svg>
        <span>in/zayaan</span>
    </a>
</div>

		<div id="github" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/mahmood-zayaan-khan-676b45358/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 
                     0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234
                     c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756
                     -1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237
                     1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604
                     -2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221
                     -.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23
                     .957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404
                     2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176
                     .77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921
                     .43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576
                     4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
    </a>
</div>
    `;
    animateCamera({ x: -0.010925 , y: -0.000001 , z: 5.4181  },{ y: 0 })
    currentAudio = new Audio('https://github.com/user-attachments/files/23751303/zzz.mp3');
    currentAudio.play();//ANIMATE CAMERA
})

document.getElementById('KI').addEventListener('click', () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    document.getElementById('KI').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('SAI').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('RAN').classList.remove('active')
    document.getElementById('sh').classList.remove('active')
    document.getElementById('content').innerHTML = 'NO SKILL'
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = `
    <h2 class="subheading">
    With expertise across these software tools, we bring creative and effective solutions to a wide range of platforms.
</h2>
<div class="social-links">
       <div id="twitter" class="social-btn flex-center">
    <a href="https://x.com/noname1322233" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775
                     1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195
                     -.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045
                     -4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574
                     -.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89
                     -.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419
                     -2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212
                     9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z">
            </path>
        </svg>
        <span>x/noname</span>
    </a>
</div>
	<div id="linkedin" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/sai-kiran-k-2a20b9287/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
        </svg>
        <span>in/noname</span>
    </a>
</div>

		<div id="github" class="social-btn flex-center">
    <a href="https://github.com/NONAME-OP" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 
                     0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234
                     c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756
                     -1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237
                     1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604
                     -2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221
                     -.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23
                     .957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404
                     2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176
                     .77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921
                     .43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576
                     4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
    </a>
</div>
    `;
    animateCamera({ x: -4.05, y: 0.5, z: 2.5},{x:0,z:0, y: -0.0 })
    currentAudio = new Audio('https://github.com/user-attachments/files/23751360/s.mp3');
    currentAudio.play();
})//suk
document.getElementById('RAN').addEventListener('click', () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    document.getElementById('RAN').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('SAI').classList.remove('active')
    document.getElementById('KI').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('sh').classList.remove('active')
    document.getElementById('content').innerHTML = 'THE ONE WHO INVENTED THE UNIVERSE THE GREAT YESU IS HIM ITSELF WITH MASTERS IN CRISTIANITY AND COMPUTER TECHNOLOGIES'
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = `
    <h2 class="subheading">
    With expertise across these software tools, we bring creative and effective solutions to a wide range of platforms.
</h2>
        <div class="social-links">
		<div id="twitter" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/golla-sukumar-44729a365/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775
                     1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195
                     -.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045
                     -4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574
                     -.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89
                     -.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419
                     -2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212
                     9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z">
            </path>
        </svg>
        <span>x/golla</span>
    </a>
</div>
	<div id="linkedin" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/golla-sukumar-44729a365/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
        </svg>
        <span>in/golla</span>
    </a>
</div>

		<div id="github" class="social-btn flex-center">
    <a href="https://www.linkedin.com/in/golla-sukumar-44729a365/" target="_blank" class="flex-center">
        <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.626 0-12 5.373-12 12 
                     0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234
                     c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756
                     -1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237
                     1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604
                     -2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221
                     -.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23
                     .957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404
                     2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176
                     .77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921
                     .43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576
                     4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <span>GitHub</span>
    </a>
</div>
    `;
    animateCamera({ x: -0.4, y: 4.4, z: 1 },{x:0,z:0, y: -0.0 })
    currentAudio = new Audio('https://github.com/user-attachments/files/23751362/ssk.mp3');
    currentAudio.play();
})

// Add missing 'sh' button handler
document.getElementById('sh').addEventListener('click', () => {
    if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
    document.getElementById('sh').classList.add('active')
    document.getElementById('aglaea').classList.remove('active')
    document.getElementById('euphre').classList.remove('active')
    document.getElementById('SAI').classList.remove('active')
    document.getElementById('KI').classList.remove('active')
    document.getElementById('thalia').classList.remove('active')
    document.getElementById('RAN').classList.remove('active')
    
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = `
    <h2 class="subheading">
        LUFFY - The future Pirate King with determination and courage
    </h2>
    <div class="social-links">
        <div id="twitter" class="social-btn flex-center">
            <a href="#" target="_blank" class="flex-center">
                <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
                <span>x/luffy</span>
            </a>
        </div>
        <div id="linkedin" class="social-btn flex-center">
            <a href="#" target="_blank" class="flex-center">
                <svg viewBox="0 0 24 24" height="24" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                </svg>
                <span>in/luffy</span>
            </a>
        </div>
        <div id="github" class="social-btn flex-center">
            <a href="#" target="_blank" class="flex-center">
                <svg viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
            </a>
        </div>
    </div>
    `;
    animateCamera({ x: 2.0, y: 1.5, z: 3.0 }, { x: 0, z: 0, y: -0.1 });
    currentAudio = new Audio('https://github.com/user-attachments/files/23751382/luffy.mp3');
    currentAudio.play();
})

/////////////////////////////////////////////////////////////////////////
//// ANIMATE CAMERA
function animateCamera(position, rotation){
    new TWEEN.Tween(camera2.position).to(position, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
    })
    new TWEEN.Tween(camera2.rotation).to(rotation, 1800).easing(TWEEN.Easing.Quadratic.InOut).start()
    .onComplete(function () {
        TWEEN.remove(this)
    })
}

/////////////////////////////////////////////////////////////////////////
//// PARALLAX CONFIG
const cursor = {x:0, y:0}
const clock = new Clock()
let previousTime = 0

/////////////////////////////////////////////////////////////////////////
//// RENDER LOOP FUNCTION

function rendeLoop() {

    TWEEN.update()

    // Update animation mixer if it exists
    if (mixer) {
        const deltaTime = clock.getDelta();
        mixer.update(deltaTime);
    }

    if (secondContainer){
        renderer2.render(scene, camera2)
    } else{
        renderer.render(scene, camera)
    }

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    const parallaxY = cursor.y
    fillLight.position.y -= ( parallaxY *9 + fillLight.position.y -2) * deltaTime

    const parallaxX = cursor.x
    fillLight.position.x += (parallaxX *8 - fillLight.position.x) * 2 * deltaTime

    cameraGroup.position.z -= (parallaxY/3 + cameraGroup.position.z) * 2 * deltaTime
    cameraGroup.position.x += (parallaxX/3 - cameraGroup.position.x) * 2 * deltaTime

    requestAnimationFrame(rendeLoop)
}

rendeLoop()

//////////////////////////////////////////////////
//// ON MOUSE MOVE TO GET CAMERA POSITION
document.addEventListener('mousemove', (event) => {
    event.preventDefault()

    cursor.x = event.clientX / window.innerWidth -0.5
    cursor.y = event.clientY / window.innerHeight -0.5

    handleCursor(event)
}, false)

//////////////////////////////////////////////////
//// DISABLE RENDERER BASED ON CONTAINER VIEW
const watchedSection = document.querySelector('.second')

function obCallback(payload) {
    if (payload[0].intersectionRatio > 0.05){
        secondContainer = true
    }else{
        secondContainer = false
    }
}

const ob = new IntersectionObserver(obCallback, {
    threshold: 0.05
})

ob.observe(watchedSection)

//////////////////////////////////////////////////
//// MAGNETIC MENU
const btn = document.querySelectorAll('nav > .a')
const customCursor = document.querySelector('.cursor')

function update(e) {
    const span = this.querySelector('span')
    
    if(e.type === 'mouseleave') {
        span.style.cssText = ''
    } else {
        const { offsetX: x, offsetY: y } = e,{ offsetWidth: width, offsetHeight: height } = this,
        walk = 20, xWalk = (x / width) * (walk * 2) - walk, yWalk = (y / height) * (walk * 2) - walk
        span.style.cssText = `transform: translate(${xWalk}px, ${yWalk}px);`
    }
}

const handleCursor = (e) => {
    const x = e.clientX
    const y =  e.clientY
    
    // Only update cursor if the element exists
    if (customCursor) {
        customCursor.style.cssText =`left: ${x}px; top: ${y}px;`
    }
    
    // Update cursor coordinates for parallax effect
    cursor.x = x / window.innerWidth - 0.5
    cursor.y = y / window.innerHeight - 0.5
}

btn.forEach(b => b.addEventListener('mousemove', update))
btn.forEach(b => b.addEventListener('mouseleave', update))

// Hide loading video and show main content on first scroll
window.addEventListener('scroll', function handleFirstScroll() {
    const loadingVideoContainer = document.getElementById('loading-video-container');
    if (loadingVideoContainer) {
        loadingVideoContainer.style.display = 'none';
        document.querySelector('.main-container').style.visibility = 'visible';
        window.removeEventListener('scroll', handleFirstScroll);
    }
}, { once: true });
 const testimonials = [
      {
        name: "VENU PRASAD A",
        role: "Product Manager at TechFlow",
        quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for."
      },
      {
        name: "Michael Rodriguez",
        role: "CTO at InnovateSphere",
        quote: "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable."
      },
      {
        name: "Emily Watson",
        role: "Operations Director at CloudScale",
        quote: "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple."
      },
      {
        name: "James Kim",
        role: "Engineering Lead at DataPro",
        quote: "Outstanding support and robust features. It's rare to find a product that delivers on all its promises."
      },
      {
        name: "Lisa Thompson",
        role: "VP of Technology at FutureNet",
        quote: "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business."
      },
      {
        name: "Lisa Thompson",
        role: "VP of Technology at FutureNet",
        quote: "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business."
      },
      {
        name: "Lisa Thompson",
        role: "VP of Technology at FutureNet",
        quote: "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business."
      }
    ];

    let currentIndex = 0;

    const images = document.querySelectorAll(".testimonial-image-stack img");
    const content = document.querySelector(".testimonial-content");
    const nameEl = document.querySelector(".testimonial-name");
    const roleEl = document.querySelector(".testimonial-role");
    const quoteEl = document.querySelector(".testimonial-quote");

    function updateTestimonial(index) {
      // Image animation
      images.forEach((img, i) => {
        img.classList.toggle("active", i === index);
      });

      // Hide content before updating
      content.classList.remove("show");
      setTimeout(() => {
        nameEl.textContent = testimonials[index].name;
        roleEl.textContent = testimonials[index].role;
        quoteEl.textContent = testimonials[index].quote;
        content.classList.add("show");
      }, 300);
    }

    document.getElementById("nextBtn").addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      updateTestimonial(currentIndex);
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      updateTestimonial(currentIndex);
    });
     const spotlight = document.getElementById("spotlight");
    document.addEventListener("mousemove", (e) => {
      spotlight.style.left = e.pageX + "px";
      spotlight.style.top = e.pageY + "px";
    }); 
   
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup');
  const trigger = document.querySelector('.glowing-box-button');

  // open on EXPLORE
  trigger.addEventListener('click', () => {
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
  });

  // close when clicking outside the form
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('open');
      popup.setAttribute('aria-hidden', 'true');
    }
  });
});
const ALLOWED_EMAILS = [
  "admin@noname.com",
  "saikiran2425k@gmail.com"
];

const ALLOWED_DOMAINS = [
  "noname.com"
];
