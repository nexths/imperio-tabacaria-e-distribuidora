'use strict';

(function() {
  var Marzipano = window.Marzipano;
  var bowser = window.bowser;
  var screenfull = window.screenfull;
  var data = window.APP_DATA;

  var panoElement = document.querySelector('#pano');
  var sceneNameElement = document.querySelector('#titleBar .sceneName');
  var sceneListElement = document.querySelector('#sceneList');
  var sceneElements = document.querySelectorAll('#sceneList .scene');
  var sceneListToggleElement = document.querySelector('#sceneListToggle');
  var autorotateToggleElement = document.querySelector('#autorotateToggle');
  
  // Variável para sabermos qual cena está aberta no momento
  var activeScene = null;

  if (window.matchMedia) {
    var setMode = function() {
      if (mql.matches) {
        document.body.classList.remove('desktop');
        document.body.classList.add('mobile');
      } else {
        document.body.classList.remove('mobile');
        document.body.classList.add('desktop');
      }
    };
    var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
    setMode();
    mql.addListener(setMode);
  } else {
    document.body.classList.add('desktop');
  }

  document.body.classList.add('no-touch');
  window.addEventListener('touchstart', function() {
    document.body.classList.remove('no-touch');
    document.body.classList.add('touch');
  });

  if (bowser.msie && parseFloat(bowser.version) < 11) {
    document.body.classList.add('tooltip-fallback');
  }

  var viewerOpts = {
    controls: {
      mouseViewMode: data.settings.mouseViewMode
    }
  };

  var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

  var scenes = data.scenes.map(function(data) {
    var urlPrefix = "tiles";
    var source = Marzipano.ImageUrlSource.fromString(
      urlPrefix + "/" + data.id + "/{z}/{f}/{y}/{x}.jpg",
      { cubeMapPreviewUrl: urlPrefix + "/" + data.id + "/preview.jpg" });
    var geometry = new Marzipano.CubeGeometry(data.levels);

    var limiter = Marzipano.RectilinearView.limit.traditional(data.faceSize, 100*Math.PI/180, 120*Math.PI/180);
    var view = new Marzipano.RectilinearView(data.initialViewParameters, limiter);

    var scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    // Array para guardar os hotspots desta cena e checar a distância depois
    var sceneHotspots = [];

    data.linkHotspots.forEach(function(hotspot) {
      var element = createLinkHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      
      // Salva a referência da bolinha e a posição 3D dela
      sceneHotspots.push({
        element: element,
        yaw: hotspot.yaw,
        pitch: hotspot.pitch
      });
    });

    data.infoHotspots.forEach(function(hotspot) {
      var element = createInfoHotspotElement(hotspot);
      scene.hotspotContainer().createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });
    });

    return {
      data: data,
      scene: scene,
      view: view,
      hotspots: sceneHotspots // Guarda a lista de hotspots na cena
    };
  });

  var autorotate = Marzipano.autorotate({
    yawSpeed: 0.03,
    targetPitch: 0,
    targetFov: Math.PI/2
  });
  if (data.settings.autorotateEnabled) {
    autorotateToggleElement.classList.add('enabled');
  }

  autorotateToggleElement.addEventListener('click', toggleAutorotate);
  sceneListToggleElement.addEventListener('click', toggleSceneList);

  scenes.forEach(function(scene) {
    var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
    el.addEventListener('click', function() {
      switchScene(scene);
      if (document.body.classList.contains('mobile')) {
        hideSceneList();
      }
    });
  });

  var viewUpElement = document.querySelector('#viewUp');
  var viewDownElement = document.querySelector('#viewDown');
  var viewLeftElement = document.querySelector('#viewLeft');
  var viewRightElement = document.querySelector('#viewRight');
  var viewInElement = document.querySelector('#viewIn');
  var viewOutElement = document.querySelector('#viewOut');

  var velocity = 0.7;
  var friction = 3;

  var controls = viewer.controls();
  controls.registerMethod('upElement',    new Marzipano.ElementPressControlMethod(viewUpElement,     'y', -velocity, friction), true);
  controls.registerMethod('downElement',  new Marzipano.ElementPressControlMethod(viewDownElement,   'y',  velocity, friction), true);
  controls.registerMethod('leftElement',  new Marzipano.ElementPressControlMethod(viewLeftElement,   'x', -velocity, friction), true);
  controls.registerMethod('rightElement', new Marzipano.ElementPressControlMethod(viewRightElement,  'x',  velocity, friction), true);
  controls.registerMethod('inElement',    new Marzipano.ElementPressControlMethod(viewInElement,  'zoom', -velocity, friction), true);
  controls.registerMethod('outElement',   new Marzipano.ElementPressControlMethod(viewOutElement, 'zoom',  velocity, friction), true);

  function sanitize(s) {
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
  }

  function switchScene(scene) {
    stopAutorotate();
    scene.view.setParameters(scene.data.initialViewParameters);
    scene.scene.switchTo();
    activeScene = scene; // Atualiza qual é a cena ativa
    startAutorotate();
    updateSceneName(scene);
    updateSceneList(scene);
  }

  function updateSceneName(scene) {
    if (sceneNameElement) {
      sceneNameElement.innerHTML = sanitize(scene.data.name);
    }
  }

  function updateSceneList(scene) {
    for (var i = 0; i < sceneElements.length; i++) {
      var el = sceneElements[i];
      if (el.getAttribute('data-id') === scene.data.id) {
        el.classList.add('current');
      } else {
        el.classList.remove('current');
      }
    }
  }

  function hideSceneList() {
    sceneListElement.classList.remove('enabled');
    sceneListToggleElement.classList.remove('enabled');
  }

  function toggleSceneList() {
    sceneListElement.classList.toggle('enabled');
    sceneListToggleElement.classList.toggle('enabled');
  }

  function startAutorotate() {
    if (!autorotateToggleElement.classList.contains('enabled')) {
      return;
    }
    viewer.startMovement(autorotate);
    viewer.setIdleMovement(3000, autorotate);
  }

  function stopAutorotate() {
    viewer.stopMovement();
    viewer.setIdleMovement(Infinity);
  }

  function toggleAutorotate() {
    if (autorotateToggleElement.classList.contains('enabled')) {
      autorotateToggleElement.classList.remove('enabled');
      stopAutorotate();
    } else {
      autorotateToggleElement.classList.add('enabled');
      startAutorotate();
    }
  }

 function createLinkHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('link-hotspot');

    var container = document.createElement('div');
    container.classList.add('link-hotspot-container');

    wrapper.addEventListener('click', function() {
      var targetScene = findSceneById(hotspot.target);
      if (targetScene) {
        stopAutorotate();
        var viewParams = hotspot.targetViewParameters ? hotspot.targetViewParameters : targetScene.data.initialViewParameters;
        targetScene.view.setParameters(viewParams);
        targetScene.scene.switchTo();
        
        // CORREÇÃO: Avisa o radar que mudamos de cena!
        activeScene = targetScene; 
        
        startAutorotate();
        updateSceneName(targetScene);
        updateSceneList(targetScene);
      }
    });

    stopTouchAndScrollEventPropagation(wrapper);

    var tooltip = document.createElement('div');
    tooltip.classList.add('hotspot-tooltip');
    tooltip.classList.add('link-hotspot-tooltip');
    tooltip.innerHTML = findSceneDataById(hotspot.target).name;

    wrapper.appendChild(container);
    wrapper.appendChild(tooltip);

    return wrapper;
  }

  function createInfoHotspotElement(hotspot) {
    var wrapper = document.createElement('div');
    wrapper.classList.add('hotspot');
    wrapper.classList.add('info-hotspot');

    var header = document.createElement('div');
    header.classList.add('info-hotspot-header');

    var iconWrapper = document.createElement('div');
    iconWrapper.classList.add('info-hotspot-icon-wrapper');
    var icon = document.createElement('img');
    icon.src = 'img/info.png';
    icon.classList.add('info-hotspot-icon');
    iconWrapper.appendChild(icon);

    var titleWrapper = document.createElement('div');
    titleWrapper.classList.add('info-hotspot-title-wrapper');
    var title = document.createElement('div');
    title.classList.add('info-hotspot-title');
    title.innerHTML = hotspot.title;
    titleWrapper.appendChild(title);

    var closeWrapper = document.createElement('div');
    closeWrapper.classList.add('info-hotspot-close-wrapper');
    var closeIcon = document.createElement('img');
    closeIcon.src = 'img/close.png';
    closeIcon.classList.add('info-hotspot-close-icon');
    closeWrapper.appendChild(closeIcon);

    header.appendChild(iconWrapper);
    header.appendChild(titleWrapper);
    header.appendChild(closeWrapper);

    var text = document.createElement('div');
    text.classList.add('info-hotspot-text');
    text.innerHTML = hotspot.text;

    wrapper.appendChild(header);
    wrapper.appendChild(text);

    var modal = document.createElement('div');
    modal.innerHTML = wrapper.innerHTML;
    modal.classList.add('info-hotspot-modal');
    document.body.appendChild(modal);

    var toggle = function() {
      wrapper.classList.toggle('visible');
      modal.classList.toggle('visible');
    };

    wrapper.querySelector('.info-hotspot-header').addEventListener('click', toggle);
    modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', toggle);

    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  function stopTouchAndScrollEventPropagation(element) {
    var eventList = [ 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel', 'mousewheel' ];
    for (var i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function(event) {
        event.stopPropagation();
      });
    }
  }

  function findSceneById(id) {
    for (var i = 0; i < scenes.length; i++) {
      if (scenes[i].data.id === id) {
        return scenes[i];
      }
    }
    return null;
  }

  function findSceneDataById(id) {
    for (var i = 0; i < data.scenes.length; i++) {
      if (data.scenes[i].id === id) {
        return data.scenes[i];
      }
    }
    return null;
  }

  // Lógica de Áudio
  var bgMusic = document.querySelector('#bgMusic');
  var musicToggleBtn = document.querySelector('#musicToggle');

  if (bgMusic) {
    bgMusic.volume = 0.1; 
  }

  function updateMusicIcon() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      musicToggleBtn.classList.remove('enabled');
    } else {
      musicToggleBtn.classList.add('enabled');
    }
  }

  function playAudio() {
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().then(function() {
        updateMusicIcon();
      }).catch(function(error) {
        console.log("Autoplay bloqueado aguardando interação.", error);
      });
    }
  }

  function startAudioOnFirstInteraction() {
    playAudio();
    window.removeEventListener('click', startAudioOnFirstInteraction);
    window.removeEventListener('touchstart', startAudioOnFirstInteraction);
  }

  window.addEventListener('click', startAudioOnFirstInteraction);
  window.addEventListener('touchstart', startAudioOnFirstInteraction);

  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (bgMusic.paused) {
        bgMusic.play().then(updateMusicIcon);
      } else {
        bgMusic.pause();
        updateMusicIcon();
      }
    });
  }

  // ==========================================
  // LÓGICA DE RADAR: ATIVA BOLINHAS SE OLHARMOS PRA ELAS
  // ==========================================
  function updateHotspotsProximity() {
    if (activeScene) {
      var view = activeScene.view;
      var currentYaw = view.yaw();
      var currentPitch = view.pitch();

      activeScene.hotspots.forEach(function(hs) {
        // Calcula a menor distância matemática entre a câmera e a bolinha
        var dy = Math.abs(currentYaw - hs.yaw) % (2 * Math.PI);
        if (dy > Math.PI) dy = 2 * Math.PI - dy;
        var dp = Math.abs(currentPitch - hs.pitch);
        var dist = Math.sqrt(dy * dy + dp * dp);

        // Limite de 0.4 radianos (~23 graus). Se estiver mais perto, liga o pulso.
        if (dist < 0.4) {
          hs.element.classList.add('active');
        } else {
          hs.element.classList.remove('active');
        }
      });
    }
    // Repete a verificação nos próximos quadros do navegador
    requestAnimationFrame(updateHotspotsProximity);
  }
  
  // Inicia o radar
  requestAnimationFrame(updateHotspotsProximity);

  // Inicializa o tour na cena principal
  switchScene(scenes[2]);



// ==========================================
  // HELPER: Pegar coordenadas da câmera (yaw, pitch, fov)
  // ==========================================
  window.getview = function() {
    var view = viewer.view();
    if (view) {
      var params = {
        yaw: view.yaw(),
        pitch: view.pitch(),
        fov: view.fov()
      };
      console.log('%c--- COPIE O BLOCO ABAIXO ---', 'color: #00ff00; font-weight: bold;');
      console.log('"targetViewParameters": ' + JSON.stringify(params, null, 2));
      return params;
    }
  };

  window.addEventListener('keydown', function(e) {
    if (e.key === 'p' || e.key === 'P' || e.key === 'v' || e.key === 'V') {
      window.getview();
    }








});










})();