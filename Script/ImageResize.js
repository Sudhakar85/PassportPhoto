// https://css-tricks.com/how-do-you-structure-javascript-the-module-pattern-edition/
//http://jsbin.com/palota/1/edit?html,js,output

var config;

var ImageResizeModule = {
    settings: {
        PhotoSize: $('#ddPhotoSize'),
        PrintSize: $('#ddPrintSize'),
        btnDownload: $('#download'),
        btnFile: $('#fileUpload'),
        dvPrintSize: $('#dvPrintSize'),
        canEnhance: $('#canEnhance'),
        canCrop: $('#canCrop'),
        canEdit: $('#canEdit'),
        dvStep4: $('#dvStep4'),
        OriginalImage: null,
        canDrawImage: $('#canDrawImage'),
        btnEnhanceReset: $('#btnEnhanceReset'),
        btnBrightReset: $('#btnBrightReset'),
        btnZoomIn: $('#btnZoomIn'),
        btnZoomOut: $('#btnZoomOut'),
        btnCropReset: $('#btnCropReset'),
        btnCropPhoto: $('#btnCropPhoto'),
        chkDrawLine : $('#chkDrawLine'),
        OneInch: 96,
        defaultPhotoWidth: 192,
        defaultPhotoHeight: 192,
        originalImageWidth: 192,
        originalImageHeight: 192,
        OriginalCanvas: null,
        Scale: 0,
        fcanvas: null,
        fabricImage: null
    },
    init: function () {
        this.settings.btnFile = $('#fileUpload');
        this.settings.btnDownload = $('#download');
        this.settings.PhotoSize = $('#ddPhotoSize');
        this.settings.PrintSize = $('#ddPrintSize');
        this.settings.dvPrintSize = $('#dvPrintSize');
        this.settings.dvStep4 = $('#dvStep4');
        this.settings.canCrop = $('#canCrop')[0];
        this.settings.canEdit = $('#canEdit')[0];
        this.settings.canEnhance = $('#canEnhance')[0];
        this.settings.canDrawImage = $('#canDrawImage')[0];
        this.settings.btnEnhanceReset = $('#btnEnhanceReset');
        this.settings.btnBrightReset = $('#btnBrightReset');
        this.settings.dvContrastAmount = $('#dvContrastAmount');
        this.settings.dvBrightnessAmount = $('#dvBrightnessAmount');
        this.settings.dvGameAmount = $('#dvGameAmount');
        this.settings.btnZoomIn = $('#btnZoomIn');
        this.settings.btnZoomOut = $('#btnZoomOut');
        this.settings.btnCropReset = $('#btnCropReset');
        this.settings.btnCropPhoto = $('#btnCropPhoto');
        this.settings.chkDrawLine = $('#chkDrawLine');

        config = this.settings;

        this.LoadInitialData();
        this.bindUIAction();

        config.dvContrastAmount.text('0');
        config.dvBrightnessAmount.text('0');
        config.dvGameAmount.text("1.2");

        var isSupported = this.IsCanvasSupported;

        if (isSupported) {
            this.DrawCanvasBackground(0, 0);
            config.fcanvas = new fabric.Canvas('canCrop');
        }


        return isSupported;
    },

    IsCanvasSupported: function () {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    },

    bindUIAction: function () {

        config.btnFile.on('click', function () {
            $(this).attr("value", "");
        });
        config.btnFile.change(function () {
            ImageResizeModule.UploadImage();
        });
        config.btnDownload.on("click", function () {
            ImageResizeModule.DownLoadImage();
        });
        config.PrintSize.change(function () {
            config.dvPrintSize.slider("value", this.selectedIndex);
            ImageResizeModule.ResizeImage();
        });
        config.btnBrightReset.on('click', function () {
            ImageResizeModule.ResetEdit();
        });
        config.btnEnhanceReset.on('click', function () {
            ImageResizeModule.ResetEnhance();
        });
        config.btnZoomIn.on('click', function () {
            ImageResizeModule.ZoomIn();
        });
        config.btnZoomOut.on('click', function () {
            ImageResizeModule.ZoomOut();
        });
        config.btnCropReset.on('click', function () {
            ImageResizeModule.ResetCrop();
        });
        config.btnCropPhoto.on('click', function () {
            ImageResizeModule.Crop();
        });
        config.chkDrawLine.change(function () {
            ImageResizeModule.ResizeImage();
        });
        $('nav a').on('click', function () {
            var scrollAnchor = $(this).attr('data-scroll'),
                scrollPoint = $('div[data-anchor="' + scrollAnchor + '"]').offset().top;
            $('body,html').animate({
                scrollTop: scrollPoint
            }, 500);

            return false;

        })
    },
    UploadImage: function () {

        this.settings.OriginalImage = null;
        var imageFile = this.settings.btnFile[0].files[0];

        if (Math.round(imageFile.size / 1024) > 5120) {
            alert('File size can not be more than 5MB');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (event) {

            var imageTemp = new Image();
            imageTemp.src = event.target.result;
            imageTemp.onload = function () {


                config.originalImageHeight = this.height;
                config.originalImageWidth = this.width;
                ImageResizeModule.updateCanCrop(imageTemp);
                ImageResizeModule.CloneCanvas(imageTemp);
            };
        };

        reader.onerror = function (event) {
            alert('File upload error :' + event.target.error.code);
            console.log('File upload error ' + event.target.error.code);
        };
        reader.readAsDataURL(imageFile);
    },
    CloneCanvas: function (oldCanvas) {

        this.settings.OriginalCanvas = oldCanvas;
    },
    ZoomIn: function () {
        config.fcanvas.setZoom(config.fcanvas.getZoom() * 1.1);
    },
    ZoomOut: function () {

        config.fcanvas.setZoom(config.fcanvas.getZoom() / 1.1);
    },
    ResetCrop: function () {
        this.updateCanCrop(this.settings.OriginalCanvas);
    },
    Crop: function () {

        var canvas = config.canCrop;
        var context = canvas.getContext('2d');

        var myImageData = context.getImageData(0, 0, config.defaultPhotoWidth, config.defaultPhotoHeight);

        this.updateCanEdit(myImageData);

    },
    DrawCanvasBackground: function (width, height) {
        var context = config.canDrawImage.getContext('2d');
        //context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.fillStyle = "#ffffff";
        if (width > 0)
            context.fillRect(0, 0, width, height);
        else
            context.fillRect(0, 0, 576, 384);
    },
    LoadInitialData: function () {
        $.getJSON("Data.json", function () {
            console.log('success');
        }).done(function (data) {
            var item = [];

            //$.each(data.PhotoSize, function (key, val) {
            //    //config.$PhotoSize.append('<option value="' + val.Value + '"> ' + val.Text + '</option>');
            //    $('#ddPhotoSize').append('<option value="' + val.Value + '"> ' + val.Text + '</option>');
            //});

            $.each(data.FrameSize, function (key, val) {
                //config.$PrintSize.append('<option value="' + val.Value + '"> ' + val.Text + '</option>');
                $('#ddPrintSize').append('<option value="' + val.Value + '"> ' + val.Text + '</option>');
            });
        }).fail(function (error, jqHR) {
            console.log('Not able to load the json data' + jqHR);
        });
    },

    updateCanCrop: function (img) {

        var Oldimg = config.fcanvas.getActiveObject();
        config.fcanvas.remove(Oldimg);
        config.fcanvas.renderAll();

        var oImg = new fabric.Image(img);

        oImg.set({
            angle: 0,
            padding: 10,
            cornersize: 10,
            height: config.originalImageHeight,
            width: config.originalImageWidth,
        });
        config.fcanvas.setZoom(1);
        config.fcanvas.centerObject(oImg);
        config.fcanvas.add(oImg);
        config.fcanvas.renderAll();
    },
    updateCanEdit: function (img) {
        var canvas = config.canEdit;
        var context = canvas.getContext('2d');

        if (img.data != undefined)
            context.putImageData(img, 0, 0);
        else
            context.drawImage(img, 0, 0, config.defaultPhotoWidth, config.defaultPhotoHeight);

        this.ResetEnhance();
    },

    updateCanvas: function (img) {
        this.updateCanCrop(img);
        this.updateCanEdit(img);
        this.updatecanEnhance(img);
    },
    ResetEnhance: function () {
        this.updatecanEnhance(config.canEdit);
        $("#dvAutoEnhance").slider("value", "1.2");
        config.dvGameAmount.text("1.2"); //default best output
    },

    AutoEnhance: function (gama) {
        config.dvGameAmount.text(gama);
        Filters.autoEnhance(Filters.getPixels(this.settings.canEdit), gama);
    },
    updatecanEnhance: function (img) {
        var canvas = config.canEnhance;
        var context = canvas.getContext('2d');
        if (img.data != undefined)
            context.putImageData(img, 0, 0);
        else
            context.drawImage(img, 0, 0, config.defaultPhotoWidth, config.defaultPhotoHeight);

        ImageResizeModule.ResizeImage();
    },
    DownLoadImage: function () {
        var filename = "photo.jpeg";
        if ('msToBlob' in config.canDrawImage) {
            var blob = config.canDrawImage.msToBlob();
            navigator.msSaveBlob(blob, filename);
        }
        else {
            var canwasImageURL = document.getElementById('canDrawImage').toDataURL('image/jpeg');
            document.getElementById('download').href = canwasImageURL.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
            document.getElementById('download').download = "photo.jpeg";
        }
    },
    Preview: function () {
        this.ResizeImage();
    },
    ResetEdit: function () {
        $("#dvBrightness").slider("value", "0");
        $("#dvContrest").slider("value", "0");

        config.dvContrastAmount.text('0');
        config.dvBrightnessAmount.text('0');
        this.updateCanEdit(this.settings.canCrop);
        this.ResetEnhance();
    },
    EditImage: function () {
        var brightness = $("#dvBrightness").slider("value");
        var contrast = $("#dvContrest").slider("value");

        config.dvContrastAmount.text(contrast);
        config.dvBrightnessAmount.text(brightness);

        if (brightness > 0 && contrast > 0) {
            Filters.brightness(Filters.getPixels(this.settings.canCrop), brightness);
            Filters.contrast(Filters.getPixels(this.settings.canEdit), contrast);
        }
        else if (brightness > 0) {
            Filters.brightness(Filters.getPixels(this.settings.canCrop), brightness);
        }
        else if (contrast > 0) {
            Filters.contrast(Filters.getPixels(this.settings.canCrop), contrast);
        }
        else {
            this.ResetEdit();
        }

    },
    DrawLine: function (context, x, y, x1, y1) {
        if (config.chkDrawLine.is(':checked')) {
            context.beginPath();
            context.moveTo(x, y);
            //context.strokeStyle = '#ffffff';
            context.lineTo(x1, y1);
            context.stroke();
        }
    },
    ResizeImage: function () {
        //http://www.unitconversion.org/typography/inchs-to-pixels-y-conversion.html

        var canvas = config.canDrawImage;
        var context = canvas.getContext('2d');

        var img = config.canEnhance;

        var printSize = config.PrintSize.val();

        var printWidth = parseInt(printSize.split('x')[0]);
        var printHeight = parseInt(printSize.split('x')[1]);

        var imageWidth = this.settings.defaultPhotoWidth;
        var imageHeight = this.settings.defaultPhotoHeight;

        var maxWidth = printWidth * this.settings.OneInch;
        var maxHeight = printHeight * this.settings.OneInch;

        canvas.width = maxWidth;
        canvas.height = maxHeight;
        this.DrawCanvasBackground(maxWidth, maxHeight);
        
        var spaceBetweenImage = 0;
        var startX = 0;
        var startY = 0;
        var numberOfPhoto = 0;
        var lineSpace = 0;
        if (config.chkDrawLine.is(':checked')) {
            lineSpace = 1;
            spaceBetweenImage = 1;
        }

        numberOfPhoto = Math.floor(maxWidth / imageWidth);

        var maxPhotoinHorizontal = (imageWidth * numberOfPhoto) + (numberOfPhoto * spaceBetweenImage) > maxWidth ? numberOfPhoto - 1 : numberOfPhoto;

        numberOfPhoto = Math.floor(maxHeight / imageHeight);
        var maxPhotoinVertical = (imageHeight * numberOfPhoto) + (numberOfPhoto * spaceBetweenImage) > maxHeight ? numberOfPhoto - 1 : numberOfPhoto;

        for (var y = 0; y < maxPhotoinVertical ; y++) {
            var lineY = (startY + imageHeight + lineSpace);
            for (var x = 0; x < maxPhotoinHorizontal; x++) {

                var lineX = (startX + imageWidth + lineSpace);
                if (maxPhotoinHorizontal > 1 && (x + 1) == maxPhotoinHorizontal)
                {
                    var remainingSpace = (startX + imageWidth);
                    if (remainingSpace <= maxWidth)
                    {
                        remainingSpace = maxWidth - remainingSpace;
                        startX += remainingSpace;
                        lineX = startX;
                    }
                }
                if (maxPhotoinVertical > 1 && (y + 1) == maxPhotoinVertical)
                {
                    var remainingSpace = (startY + imageHeight);
                    if (remainingSpace <= maxHeight) {
                        remainingSpace = maxHeight - remainingSpace;
                        startY += remainingSpace;
                        lineY = startY;
                    }
                }
                context.drawImage(img, startX, startY, imageWidth, imageHeight);

                //vertical line
                this.DrawLine(context,lineX, 0, lineX, maxHeight);
                startX = startX + imageWidth + spaceBetweenImage + lineSpace;
            }
           
            // Horizontal line
            this.DrawLine(context,0, lineY, maxWidth, lineY);
            startY = startY + imageHeight + spaceBetweenImage + lineSpace;
            startX = 0;
        }
    }

};





















