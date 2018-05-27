blipp = require('blippar').blipp;

// ####################################################################
//  ___ _    ___ ___ ___ 
// | _ ) |  |_ _| _ \ _ \
// | _ \ |__ | ||  _/  _/
// |___/____|___|_| |_|  
//                       
// ####################################################################
blipp.setIcon("blippIcon.png");
blipp.setAutoRequiredAssets(true);
// blipp.getMarker().setRotationCutoffFrequency([2,2,4.1]);//.setTranslationCutoffFrequency([5,5,1])

peel = blipp.getPeel();
peel.setOrientation("landscape").setType("fit").setScale(100);//.setOffset([0,-35]);//.setSize([100,75]);


// ####################################################################
//  ___  ___ ___ _  _ ___ 
// / __|/ __| __| \| | __|
// \__ \ (__| _|| .` | _| 
// |___/\___|___|_|\_|___|
//                        
// ####################################################################

scene = blipp.addScene("default");
scene.setScreenScaleRotate(false);
scene.setScreenOrientation('landscape');
scene.setLighting(true);

var root = scene.addTransform();

var markerW = blipp.getMarker().getWidth();
var markerH = blipp.getMarker().getHeight();
var sH = blipp.getScreenHeight()*1.003;       //2001
var sW = blipp.getScreenWidth()*1.003;        //1125
var sHeight = blipp.getScreenHeight();
var sWidth = blipp.getScreenWidth();
var iPhone6S_height = 2001;
var iPhone6S_width = 1125;
var iPad_height = 2048;
var iPad_width = 1536;

var deviceId = blipp.getSystem().getUniqueId();

var camDirection = {back : 0, front : 1};
var camera = camDirection.back;

var sensor = blipp.getSensor();
var gyroVector;

var grpAll = [];
var isOpeningAnimation = true;
var isMoneyPlaying = false;
var isExplosionPlaying = false;

scene.onCreate = function() {
  console.log("[onCreate] marker: " + blipp.getMarkerName());
  console.log("sheight: " + blipp.getScreenHeight() + "swidth: " + blipp.getScreenWidth());

  scene.addRequiredAssets([
    "money_talk.mp4","money_talk.mp3",
    "1000yen.mp4","1000yen.mp3",
    "explosion.mp4","explosion2.mp4","explosion.mp3",
    "MIP6_3mb.mp4","MIP6_2mb.mp4","MIP6_2mb.mp3"]);

  if (blipp.getSystem().getRegion() == "btest") {
    ResetBlipp = scene.getScreen().addSprite().setHAlign('left').setVAlign('top').setScale(blipp.getScreenWidth()/5)
              .setColor('ff0000').setTranslation([-blipp.getScreenWidth()/2, blipp.getScreenHeight()/2 ,100]).setAlpha(0.5).setType("aura");

    ResetBlipp.onTouchEnd = function() {
      blipp.goToBlipp(blipp.getAddress());
    }
  }

  readJSON();
  createFSMenuPage();

  fadeOut(grpAll, 0, 0);
}

scene.onShow = function() {
  // blipp.uiVisible("peelCloseButton", false);
  blipp.uiVisible("navBar", false);
  console.log("[onShow] marker: " + blipp.getMarkerName());

  fadeIn(money_video, 0, 100);
  money_video.playVideo('1000yen.mp4', '1000yen.mp3', false ,false, true);
  isMoneyPlaying = true;
}

var isTracking = true;
scene.onTrackLost = function() {
  console.log("TRACK LOST");
  blipp.lockPosition();
  
  if (!isOpeningAnimation) {
    fadeOut(t_grp, 0, 300);
    showFsMenuGrp();
  } else {
    if (isMoneyPlaying) {
      money_video.pauseVideo();
      fadeOut(money_video, 0, 300);
      fadeIn(grp_popupAim, 0, 500);
    }
    if (isExplosionPlaying) {
      explosion_video.pauseVideo();
      fadeOut(explosion_video, 0, 300);
      fadeIn(grp_popupAim, 0, 500);
    }
  }
  isTracking = false;
}

scene.onTrack = function() {
  console.log("TRACKING");
  blipp.unlock();
  
  if (!isOpeningAnimation) {
    fadeOut(grp_menuGrp, 0, 300);
    showTrMenuGrp();
  } else {
    if(!isTracking) {
      if (isMoneyPlaying) {
        money_video.resumeVideo();
        fadeOut(grp_popupAim, 0, 300);
        fadeIn(money_video, 0, 500);
      }
      if (isExplosionPlaying) {
        explosion_video.resumeVideo();
        fadeOut(grp_popupAim, 0, 300);
        fadeIn(explosion_video, 0, 500);
      }
    }
  }
  isTracking = true;
}

var t_grp = [];
var money_video, explosion_video,
    t_box1, t_box2, t_box3, t_detail, t_ticket, t_sns, t_title, t_video,
    t_sns_face, t_sns_inst, t_sns_line, t_sns_tube, t_sns_twit;
function readJSON(){
  root.read("MIBlipp.json");

  money_video = root.getChild("scene_MIBlipp").getChild("MoneyTalk");
  explosion_video = root.getChild("scene_MIBlipp").getChild("Explosion");

  t_box1 = root.getChild("scene_MIBlipp").getChild("t_box1");
  t_box2 = root.getChild("scene_MIBlipp").getChild("t_box2");
  t_box3 = root.getChild("scene_MIBlipp").getChild("t_box3");
  t_detail = root.getChild("scene_MIBlipp").getChild("t_detail");
  t_ticket = root.getChild("scene_MIBlipp").getChild("t_ticket");
  t_title = root.getChild("scene_MIBlipp").getChild("t_title");
  t_video = root.getChild("scene_MIBlipp").getChild("t_video");
  t_sns = root.getChild("scene_MIBlipp").getChild("t_sns");
  t_sns_face = root.getChild("scene_MIBlipp").getChild("t_sns_face");
  t_sns_inst = root.getChild("scene_MIBlipp").getChild("t_sns_inst");
  t_sns_line = root.getChild("scene_MIBlipp").getChild("t_sns_line");
  t_sns_tube = root.getChild("scene_MIBlipp").getChild("t_sns_tube");
  t_sns_twit = root.getChild("scene_MIBlipp").getChild("t_sns_twit");

  explosion_video.setBlend('chromakey').setChromakey([120, 0.7, 0.67, 72]).setScale(3);

  grpAll.push(money_video);
  grpAll.push(explosion_video);
  grpAll.push(t_box1);
  grpAll.push(t_box2);
  grpAll.push(t_box3);
  grpAll.push(t_detail);
  grpAll.push(t_ticket);
  grpAll.push(t_title);
  grpAll.push(t_video);
  grpAll.push(t_sns);
  grpAll.push(t_sns_face);
  grpAll.push(t_sns_inst);
  grpAll.push(t_sns_line);
  grpAll.push(t_sns_tube);
  grpAll.push(t_sns_twit);

  t_grp.push(t_box1);
  t_grp.push(t_box2);
  t_grp.push(t_box3);
  t_grp.push(t_detail);
  t_grp.push(t_ticket);
  t_grp.push(t_title);
  t_grp.push(t_video);
  t_grp.push(t_sns);
  t_grp.push(t_sns_face);
  t_grp.push(t_sns_inst);
  t_grp.push(t_sns_line);
  t_grp.push(t_sns_tube);
  t_grp.push(t_sns_twit);

  money_video.on('videoTextureEnd', function () {
    console.log("money_video ended");
    fadeOut(money_video, 500, 300);
    fadeIn(explosion_video, 0, 500);
    explosion_video.playVideo('explosion.mp4', 'explosion.mp3', false ,false, true);
    isMoneyPlaying = false;
    isExplosionPlaying = true;
  })

  explosion_video.on('videoTextureEnd', function () {
    console.log("explosion_video ended");
    fadeOut(explosion_video, 0, 300);
    showTrMenuGrp();
    isOpeningAnimation = false;
    isExplosionPlaying = false;
  })

  t_detail.onTouchEnd = function() { onClick_uiClickables(this); }
  t_ticket.onTouchEnd = function() { onClick_uiClickables(this); }
  t_sns_twit.onTouchEnd = function() { onClick_uiClickables(this); }
  t_sns_face.onTouchEnd = function() { onClick_uiClickables(this); }
  t_sns_inst.onTouchEnd = function() { onClick_uiClickables(this); }
  t_sns_line.onTouchEnd = function() { onClick_uiClickables(this); }
  t_sns_tube.onTouchEnd = function() { onClick_uiClickables(this); }
}

var grp_menuGrp = [];
var grp_popupAim = [];
var grp_popupSound = [];
var main_menuBg, main_trailerVideo,
    main_detailBtn, main_ticketBtn, main_snsTxt,
    main_snsBtn_twit, main_snsBtn_face, main_snsBtn_inst, main_snsBtn_line, main_snsBtn_tube;
function createFSMenuPage() {
  popup_soundon = createScreenSpaceAsset(["popup_soundon.jpg","popup_soundon-A.jpg"], [sH, sH*(1536/2048), 1], [0, 0, 0], grp_popupSound);
  popup_aim = createScreenSpaceAsset(["popup_aim.jpg","popup_aim-A.jpg"], [sH, sH*(1536/2048), 1], [0, 0, 0], grp_popupAim);
  main_menuBg = createScreenSpaceAsset("home_bg.jpg", [sH, sH*(1536/2048), 1], [0, 0, 0], grp_menuGrp);
  main_trailerVideo = createScreenSpaceAsset("dummy_vid.jpg", [sH*(1279/2048), sH*(577/2048), 0], [0, sH*(166/2048), 0], grp_menuGrp);
  main_detailBtn = createScreenSpaceAsset(["text_detail1.jpg","text_detail1-A.jpg"], [sH*(166/2048), sH*(30/2048), 0], [-sH*(820/2048), -sH*(275/2048), 0], grp_menuGrp);
  main_ticketBtn = createScreenSpaceAsset(["text_ticket1.jpg","text_ticket1-A.jpg"], [sH*(211/2048), sH*(31/2048), 0], [-sH*(803/2048), -sH*(412/2048), 0], grp_menuGrp);
  main_snsTxt = createScreenSpaceAsset(["text_sns.jpg","text_sns-A.jpg"], [sH*(376/2048), sH*(307/2048), 0], [sH*(805/2048), -sH*(350/2048), 0], grp_menuGrp);
  main_snsBtn_twit = createScreenSpaceAsset(["btn_twitter.jpg","btn_twitter-A.jpg"], [sH*(51/2048), sH*(51/2048), 0], [sH*(706/2048), -sH*(364/2048), 0], grp_menuGrp);
  main_snsBtn_face = createScreenSpaceAsset(["btn_facebook.jpg","btn_facebook-A.jpg"], [sH*(51/2048), sH*(51/2048), 0], [sH*(770/2048), -sH*(364/2048), 0], grp_menuGrp);
  main_snsBtn_inst = createScreenSpaceAsset(["btn_instagram.jpg","btn_instagram-A.jpg"], [sH*(51/2048), sH*(51/2048), 0], [sH*(828/2048), -sH*(364/2048), 0], grp_menuGrp);
  main_snsBtn_line = createScreenSpaceAsset(["btn_line.jpg","btn_line-A.jpg"], [sH*(51/2048), sH*(51/2048), 0], [sH*(902/2048), -sH*(364/2048), 0], grp_menuGrp);
  main_snsBtn_tube = createScreenSpaceAsset(["btn_youtube.jpg","btn_youtube-A.jpg"], [sH*(249/2048), sH*(54/2048), 0], [sH*(803/2048), -sH*(445/2048), 0], grp_menuGrp);
  
  main_detailBtn.onTouchEnd = function() { onClick_uiClickables(this); }
  main_ticketBtn.onTouchEnd = function() { onClick_uiClickables(this); }
  main_snsBtn_twit.onTouchEnd = function() { onClick_uiClickables(this); }
  main_snsBtn_face.onTouchEnd = function() { onClick_uiClickables(this); }
  main_snsBtn_inst.onTouchEnd = function() { onClick_uiClickables(this); }
  main_snsBtn_line.onTouchEnd = function() { onClick_uiClickables(this); }
  main_snsBtn_tube.onTouchEnd = function() { onClick_uiClickables(this); }
}

var isFirstTimeShowTrailer = true;
function showFsMenuGrp() {
  fadeIn(grp_menuGrp, 0, 500);
  if (isFirstTimeShowTrailer) {
    // play both trailer videos simultaneously
    main_trailerVideo.playVideo("MIP6_3mb.mp4","MIP6_2mb.mp3", true, false, false);
    t_video.playVideo("MIP6_3mb.mp4","MIP6_2mb.mp3", true, false, false);
    isFirstTimeShowTrailer = false;
  }
}

function showTrMenuGrp() {
  fadeIn(t_grp, 0, 500);
  if (isFirstTimeShowTrailer) {
    // play both trailer videos simultaneously
    main_trailerVideo.playVideo("MIP6_3mb.mp4","MIP6_2mb.mp3", true, false, false);
    t_video.playVideo("MIP6_3mb.mp4","MIP6_2mb.mp3", true, false, false);
    isFirstTimeShowTrailer = false;
  }
}

function onClick_uiClickables(model) {
  switch (model) {
    case t_detail:
    case main_detailBtn:
      animOnClick(model);
      break;
    case t_ticket:
    case main_ticketBtn:
      animOnClick(model);
      break;
    case t_sns_twit:
    case main_snsBtn_twit:
      animOnClick(model);
      break;
    case t_sns_face:
    case main_snsBtn_face:
      animOnClick(model);
      break;
    case t_sns_inst:
    case main_snsBtn_inst:
      animOnClick(model);
      break;
    case t_sns_line:
    case main_snsBtn_line:
      animOnClick(model);
      break;
    case t_sns_tube:
    case main_snsBtn_tube:
      animOnClick(model);
      break;
  }
}

// ###################################################################################
// ###################################################################################
// ############################ codeHelperFunctions ##################################
//  _  _ ___ _    ___ ___ ___   ___ _   _ _  _  ___ _____ ___ ___  _  _ ___ 
// | || | __| |  | _ \ __| _ \ | __| | | | \| |/ __|_   _|_ _/ _ \| \| / __|
// | __ | _|| |__|  _/ _||   / | _|| |_| | .` | (__  | |  | | (_) | .` \__ \
// |_||_|___|____|_| |___|_|_\ |_|  \___/|_|\_|\___| |_| |___\___/|_|\_|___/
//
// ###################################################################################                                                                          
// ###################################################################################
// ###################################################################################

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


var COLORS = {red:0, green:1, blue:2, white:3, cyan:4, magenta:5, yellow:6, black:7}

function setColorTexture(model, color) {
  var ts_x = 0.25;
  var ts_y = 0.5;
  var to_x = 0;
  var to_y = 0;

  switch (color) {
    case 0: to_x = 0;     to_y = 0;     break;
    case 1: to_x = 0.25;  to_y = 0;     break;
    case 2: to_x = 0.5;   to_y = 0;     break;
    case 3: to_x = 0.75;  to_y = 0;     break;
    case 4: to_x = 0;     to_y = 0.5;   break;
    case 5: to_x = 0.25;  to_y = 0.5;   break;
    case 6: to_x = 0.5;   to_y = 0.5;   break;
    case 7: to_x = 0.75;  to_y = 0.5;   break;
  }

  model.setTexture("colors.png").setTextureOffset([to_x, to_y]).setTextureScale([ts_x, ts_y]);
}

var swipeScrollPanel_event = {
  undefined : -1,
  tap : 0,
  flick : 1,
  flick_x : 2,
  flick_y : 3,
  long_press : 4,
  move : 5,
  other : 6,
  unknown : 7
}

var swipeScrollPanel_direction = {
  undefined : 0,
  left : 1,
  right : 2,
  up : 3, 
  down : 4,
  horizontal : 5,
  vertical : 6
}

var swipeScrollPanel_params = {
  height : 5000,
  tapRadius : sH*0.05,
  flickTime : 250,
  eventType : swipeScrollPanel_event.undefined,
  isCheckingForLongPress : true,
  moveBuffer : 5,
  swipeThreshold_x : sW*0.08,
  swipeThreshold_y : sH*0.15,
  swipeDirection : swipeScrollPanel_direction.undefined,
  longPressGroup : [],
  isAutoScrolling : false,
  autoScrollCount: 0
}

var startX = 0;
var endX = 0;
function onTouchStart_SwipeScrollPanel(model, id, tX, tY) {  
  console.log("[onTouch_START] x: " + tX + ", y: " + tY);
}

function onTouchMove_SwipeScrollPanel(model, id, tX, tY) {
}

function onTouchEnd_SwipeScrollPanel(model, id, tX, tY) {
  console.log("[onTouch_END] x: " + tX + ", y: " + tY);
}

function slideInOut(model, inout, direction, duration, type) {
  var animSlide;

  switch (direction) {
    case "up" : 
      if (inout == "in") {
        model.setVAlign("bottom");    
      } else {
        model.setVAlign("top");
      }
      break;
    case "down" :
      if (inout == "in") {
        model.setVAlign("top");       
      } else {
        model.setVAlign("bottom");
      }
    break;
    case "left" :
      if (inout == "in") {
        model.setHAlign("right");     
      } else {
        model.setHAlign("left");
      }
    break;
    case "right" :
      if (inout == "in") {
        model.setHAlign("left");      
      } else {
        model.setHAlign("right");
      }
    break;
  }

  if (inout == "in") {
    // model.setAlpha(0);
    animSlide = model.animate()
                  // .alpha(1)
                  .duration(duration)
                  .interpolator("easeOut");
  } else {
    // model.setAlpha(1);
    animSlide = model.animate()
                  // .alpha(0)
                  .duration(duration)
                  .interpolator("easeOut");
  }

  var sf = model.endSf;

  animSlide.onStart = function() {
    model.setHidden(false);
    // model.setAlpha(1);

    if (direction == "up" || direction == "down") {
      model.setTextureOffset([0,1]);
      model.setTextureScale([1,0]);
      model.setScale([sf[0], sf[1]*0, 1]); 
    } else if (direction == "left" || direction == "right") {
      model.setTextureOffset([1,0]);
      model.setTextureScale([0,1]);
      model.setScale([sf[0]*0, sf[1], 1]); 
    }
  }

  animSlide.onProgress = function(t) {
    if (direction == "up" || direction == "down") {
      if (inout == "in") { 
        if (direction == "up") {
          if (type == "wipe") {
            model.setTextureOffset([0,1-t]);
          } else {
            model.setTextureOffset([0,1]); 
          }
        } else {
          if (type == "wipe") {
            model.setTextureOffset([0,1]);
          } else {
            model.setTextureOffset([0,1-t]); 
          }
        }
        model.setTextureScale([1,t]);
        model.setScale([sf[0], sf[1]*t, 1]);
      } else {  // ################################## OUT ############
        if (direction == "up") {
          if (type == "wipe") {
            model.setTextureOffset([0,1]);
          } else {
            model.setTextureOffset([0,1-t]); 
          }
        } else {
          if (type == "wipe") {
            model.setTextureOffset([0,1-t]);
          } else {
            model.setTextureOffset([0,1]); 
          }
        }
        model.setTextureScale([1,1-t]);
        model.setScale([sf[0], sf[1]*(1-t), 1]);
      }
    } else if (direction == "left" || direction == "right") {
      if (inout == "in") { 
        if (direction == "left") {
          if (type == "wipe") {
            model.setTextureOffset([1-t,0]);
          } else {
            model.setTextureOffset([1,0]); 
          }
        } else {
          if (type == "wipe") {
            model.setTextureOffset([1,0]);
          } else {
            model.setTextureOffset([1-t,0]); 
          }
        }
        model.setTextureScale([t,1]);
        model.setScale([sf[0]*t, sf[1], 1]);
      } else {  // ################################## OUT ############
        if (direction == "left") {
          if (type == "wipe") {
            model.setTextureOffset([1,0]);
          } else {
            model.setTextureOffset([t,0]); 
          }
        } else {
          if (type == "wipe") {
            model.setTextureOffset([t,0]);
          } else {
            model.setTextureOffset([1,0]); 
          }
        }
        model.setTextureScale([1-t,1]);
        model.setScale([sf[0]*(1-t), sf[1], 1]);
      }
    }
  }

  animSlide.onEnd = function() {
  }
}

function handleToggleState(model) {
  if (model.getAttribute("state")) {
    model.setActiveTexture(1);
  } else {
    model.setActiveTexture(0);
  }
}

function animOnClick(model) {
  var sf = model.getScale();
  var mult = 1.1;
  var animClick = model.animate()
                  .scale([sf[0]*mult, sf[1]*mult, sf[2]])
                  .duration(250)
                  .interpolator("easeOut");

  animClick.onEnd = function() {
    animClick = model.animate()
                  .scale([sf[0]/mult, sf[1]/mult, sf[2]])
                  .duration(250)
                  .interpolator("easeOut");
  }

  if (model.addOn !== undefined) {
    var sf2 = model.addOn.getScale();
    var animClick2 = model.addOn.animate()
                      .scale([sf2[0]*mult, sf2[1]*mult, sf2[2]])
                      .duration(250)
                      .interpolator("easeOut");

    animClick2.onEnd = function() {
      animClick2 = model.addOn.animate()
                    .scale([sf2[0]/mult, sf2[1]/mult, sf2[2]])
                    .duration(250)
                    .interpolator("easeOut");
  }
  }
}

function animFadeTranslation(model, alpha, startLoc, endLoc, duration) {
  var animFT = model.animate()
                .alpha(alpha)
                .translation(endLoc)
                .duration(duration)
                .interpolator("easeOut");

  animFT.onStart = function() {
    model.setHidden(false);
    model.setTranslation(startLoc);
  }

  animFT.onEnd = function() {
    if (alpha == 0) {
      model.setHidden(true);
    }
  }

  return animFT;
}

function createScreenSpaceAsset(texture, scale, translation, group) {
  var ss_asset = scene.getScreen()
                      .addSprite(texture)
                      .setScale(scale)
                      .setTranslation(translation)
                      .setType("phantom")
                      .setDepthTest(false);

  // if (texture.endsWith(".png")) {
  //   ss_asset.setBlend("premult");
  // }

  ss_asset.endLoc = translation;
  ss_asset.endSf = scale;
  ss_asset.group = group;

  group.push(ss_asset);
  grpAll.push(ss_asset);

  return ss_asset;
}

function createScreenSpaceAsset_L(texture, scale, translation, group) {
  var ss_asset = createScreenSpaceAsset(texture, scale, translation, group).setRotationZ(-90);
  
  // if (texture.endsWith(".png")) {
  //   ss_asset.setBlend("premult");
  // }

  return ss_asset;
}

function enableClick(target, delay) {
  if (Object.prototype.toString.call(target) === '[object Object]') {
    delayedCall(function() { target.setClickable(true); }, delay);
  } else {
    target.forEach(
      function(currentValue) {
        delayedCall(function() { currentValue.setClickable(true); }, delay);
      }
    );
  }
}

function disableClick(target, delay) {
  if (Object.prototype.toString.call(target) === '[object Object]') {
    delayedCall(function() { target.setClickable(false); }, delay);
  } else {
    target.forEach(
      function(currentValue) {
        delayedCall(function() { currentValue.setClickable(false); }, delay);
      }
    );
  }
}

function delayedCall(func, delay) {
  scene.animate().duration(delay).onEnd = function() { func(); };
}

// function intervalCall(func, interval) {
//   scene.animate().
// }

function fadeIn(target, delay, length, alpha) {
  if (alpha === undefined || alpha == 0) {
    alpha = 1;
  }

  if (Object.prototype.toString.call(target) === '[object Object]') {
    var anim = target.animate().delay(delay).duration(length).alpha(alpha);
    anim.onStart = function() {
      target.setHidden(false);
    };
  } else {
    target.forEach(
      function(currentValue) {
        var anim = currentValue.animate().delay(delay).duration(length).alpha(alpha);
        anim.onStart = function() {
          currentValue.setHidden(false);
        };
      }
    );
  }
}

function fadeOut(target, delay, length, alpha) {
  if (alpha === undefined || alpha == 1) {
    alpha = 0;
  }

  if (Object.prototype.toString.call(target) === '[object Object]') {
    var anim = target.animate().delay(delay).duration(length).alpha(alpha);
    anim.onEnd = function() {
      target.setHidden(true);
    };
  } else {
    target.forEach(
      function(currentValue) {
        var anim = currentValue.animate().delay(delay).duration(length).alpha(alpha);
        anim.onEnd = function() {
          currentValue.setHidden(true);
        };
      }
    );
  }
}

function enableCamera() {
  if (camera == camDirection.back) {
    blipp.setCameraMode("back");
  } else {
    blipp.setCameraMode("front");
  }
}

function disableCamera() {
  blipp.setCameraMode("off");
}
