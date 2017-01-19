$(document).ready(function () {

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7&appId=1622576384722198";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date(); a = s.createElement(o),
        m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

    ga('create', 'UA-81912711-1', 'auto');
    ga('send', 'pageview');


    //$(window).scroll(function () {
    //    if ($(this).scrollTop() > 125) {
    //        $('#dvMenu').addClass("menuFixed");
    //    } else {
    //        $('#dvMenu').removeClass("menuFixed");
    //    }
    //});

    if (!ImageResizeModule.init()) {
        $('#dvCanvasNotSupported').css('visibility', 'visible');
        $('#dvCanvasNotSupported').css('display', 'inline');
        $('#dvContent').css('visibility', 'hidden');
        $('#dvContent').css('display', 'none');
        return;
    }
    else {
        $('#dvCanvasNotSupported').css('visibility', 'hidden');
        $('#dvCanvasNotSupported').css('display', 'none');
    }

    var printSize = $("#ddPrintSize");
    Filters.Init();

    ImageResizeModule.settings.dvPrintSize.slider({
        range: "min",
        min: 0,
        max: 8,
        value: printSize[0].selectedIndex,
        slide: function (event, ui) {
            printSize[0].selectedIndex = ui.value;
            ImageResizeModule.ResizeImage();
        }
    });

    

    $('#dvBrightness').slider({
        range: "min",
        min: 0,
        max: 100,
        value: 0,
        step: 0.01,
        slide: function (event, ui) {           
            ImageResizeModule.EditImage();
            //
        }
    });

    $('#dvContrest').slider({
        range: "min",
        min: 0,
        max: 50,
        value: 0,
        step: 1,
        slide: function (event, ui) {           
            ImageResizeModule.EditImage();
        }
    });

    
    $('#dvAutoEnhance').slider({
        range: "min",
        min: 0.2,
        max: 2.0,
        value: 1.2,
        step: 0.05,
        slide: function (event, ui) {            
            ImageResizeModule.AutoEnhance(ui.value);
        }
    });

    $(window).scroll(function () {
        var windscroll = $(window).scrollTop();
        if (windscroll >= 100) {
            $('nav').addClass('fixed');
        } else {

            $('nav').removeClass('fixed');           
        }

    }).scroll();

});