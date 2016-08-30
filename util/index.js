/**
 * Created by alexsandro on 29/02/16.
 */
(function(){

    var _ = require('lodash');
    var uuid = require('node-uuid');;
    var path = require('path');

    //TODO conseguir pegar o root do projeto
    const IMAGE_DIRECTORY = path.resolve(__dirname + "/../uploads/image/");

    module.exports = {
        generateUUID : generateUUID,
        generateImageName: generateImageName,
        generateFullImagePath: generateFullImagePath,
        generateImageNameNoExt:generateImageNameNoExt
    };

    function generateUUID(){
        return uuid.v4();
    }

    function generateImageName(ext){
        if(!ext) ext = ".png";

        return uuid.v4() + ext;
    }

    function generateImageNameNoExt(){
        return uuid.v4();
    }

    function generateFullImagePath(imagePathName){
        return IMAGE_DIRECTORY + "/" + imagePathName;
    }

})()
