/*! jQuery v1.11.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
function timerIncrement() {
    formIdleTime = formIdleTime + 1;
    formIdleTime > 19 && window.location.reload()
}

function setAprBoxFixed() {
    isMobile() ? ($("#apr-box").removeClass("apr-box-fixed"), $("#apr-box-spacer").height(0)) : ($("#apr-box").addClass("apr-box-fixed"), $("#apr-box-spacer").height($("#apr-box").outerHeight()))
}

function isMobile() {
    var n = $(window).width();
    return n <= 640
}

function getAge(n) {
    var t = new Date, i = new Date(n), r = t.getFullYear() - i.getFullYear(), u = t.getMonth() - i.getMonth();
    return (u < 0 || u === 0 && t.getDate() < i.getDate()) && (r = r - 1), r
}

function performPostcodeLookup(n, t) {
    var r = $(n).closest(".postcode-entry").find(".js-postcode").closest(".form-group"),
        i = $(n).closest(".applicant-address").find(".postcode-lookup-list"),
        f = $(n).closest(".applicant-address").find(".no-postcodes-found"), e = $(i).find(".address-list"),
        o = $(n).closest(".applicant-address").find(".manual-address"), u;
    if (u = r.length === 0 ? t.valid() : areaIsValid(r), u) {
        $(i).find(".enter-address-manually").on("click", function () {
            var n = $("#address-building"), t = $("#address-street"), i = $("#address-county"), r = $("#address-town"),
                o = $("#address-postcode"), u = $("#manual-address-postcode"), f = $("#manual-address-years"),
                e = $("#manual-address-months");
            n.val("");
            t.val("");
            i.val("");
            r.val("");
            u.val("");
            f.val("");
            e.val("");
            $(".update-address-row").hide();
            $(".postcode-years-months-row").hide();
            $(this).closest(".applicant-address").find(".manual-address").show();
            $(this).closest(".applicant-address").find(".postcode-lookup-list").hide();
            $(this).parents("#step10-postcode-entry-form").find(".js-btn-next").attr("data-add-manual-address-active", "true");
            $(this).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-check-additional-employment-history") == "true" && ($(this).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-add-employment", !0), $(this).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").removeAttr("data-add-manual-employment-address-active"))
        });
        console.log('e =>', e)
        searchForManyAddresses(t.val(), e, i, o, n, f)
    }
}

var processN = function (n) {
    newObjectArray = [];
    newObjectArray.push(n.result.map(item => ({ Id: { BuildingNumber: item.building_number, Country: item.country, CountryCode: ' ', County: item.county, OrganisationName: '', PostCode: item.postcode, PostTown: item.post_town, PrimaryStreet: item.thoroughfare, SubBuilding: '', TempBuildingName: '', TempBuildingNumber: item.delivery_point_suffix }, Place: item.postal_county, StreetAddress: item.building_number + ' ' + item.thoroughfare })));
    return newObjectArray[0];
}

function searchForManyAddressesCustom(n, t, i, r, u, f) {
    $(u).prop("disabled", !0);



    var settings = {
        "url": "https://api.ideal-postcodes.co.uk/v1/postcodes/" + n + "?api_key=ak_klg4tul5n2pJwOEgDy88cLpVSI0rj",
        "method": "GET",
        "timeout": 0,
        // "headers": {
        //     "X-Api-Key": "eqZvAN6QR79c15K4gPiAV50juEL5vvPX9ObtWpFY"
        // },
        success: function (newN) {
            console.log(newN.result);

            let roughN = processN(newN);
            n = roughN;
            console.log('processed N =>  ', n)

            if ($(u).prop("disabled", !1), n.length === 0 || typeof n[0].Error != "undefined")
                $(r).show(), $("#step10-postcode-entry-form").find(".js-btn-next").attr("data-add-manual-address-active", "true"), $(f).show(), i.hide(), setHeightIframe(), setTimeout(function () {
                    setHeightIframe()
                }, 500);
            else {
                $(f).hide();
                populateAddressList(n, t);
                $(i).show();

                // $(t).unbind("change").on("change", function () {
                //     this.value !== "" ? searchForSingleAddress(this.value, r) : $(r).hide()
                // })
                console.log('r=', r)
                console.log('t value', t.value)
                $(t).on("change", function () {
                    console.log(this.value);
                    populateManualAddress(this.value, t);
                })
            }

        },
        error: function () {
            $(r).show();
            $(f).show();
            setHeightIframe();
            setTimeout(function () {
                setHeightIframe()
            }, 500)
        },
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });

    $.ajax({
        cache: !0,
        // url: "https://iframe.app.autoconvert.co.uk/postcodelookup/searchmany",
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/" + n + "?api_key=ak_klg4tul5n2pJwOEgDy88cLpVSI0rj",
        // data: "postcode=" + n + "&source=" + $('input[name="Referrer"]').val(),
        // data: "search=" + n + "?api_key=ak_klg4tul5n2pJwOEgDy88cLpVSI0rj" + $('input[name="Referrer"]').val(),
        // headers: {
        //     "X-Api-Key": "ak_klg4tul5n2pJwOEgDy88cLpVSI0rj"
        // },
        success: function (n) {
            console.log(n);



        },
        error: function () {
            $(r).show();
            $(f).show();
            setHeightIframe();
            setTimeout(function () {
                setHeightIframe()
            }, 500)
        },
        dataType: "jsonp",
        timeout: 8e3
    })
}

function areaIsValidCustom(n) {
    var t = $(n);
    return t.validator("validate"), !t.data("bs.validator").hasErrors() && !t.data("bs.validator").isIncomplete()
}

function populateAddressListCustom(n, t) {
    $(t).find("option:gt(0)").remove();
    $(n).each(function () {
        var element = this;
        $(t).append($("<option><\/option>").attr("value", element.Id).text(element.StreetAddress + " " + element.Place))
    });
    setHeightIframe();
    setTimeout(function () {
        setHeightIframe()
    }, 500)
}

function searchForSingleAddressCustom(n, t) {

    console.log('search for single address =>', n);

    var address = n;
    console.log('address to be populated: ', address)

    populateManualAddress(address, t)

}

function populateManualAddressCustom(n, t) {
    var y, u, ot, it, rt, ut;
    try {
        console.log("Address result =>", n);
        console.dir(n)
    } catch (ht) {
    }
    y = n.BuildingNumber;
    u = $(t);
    n.SubBuilding !== "" && (y = n.SubBuilding + ", " + y);
    y.length === 0 && (y = n.Line1);
    var st = function (n) {
        if (typeof n.offset() != "undefined") {
            var t = n.offset();
            $("html, body").animate({ scrollTop: t.top }, 100)
        }
    }, r = u.parents(".js-form-area").attr("id").indexOf("employment") > -1 ? "Employment" : "Addresses",
        i = u.parents(".js-form-area"),
        c = r == "Addresses" ? $(".js-addresses-holder-display").first().find(".js-address").length === 0 ? 0 : $(".js-addresses-holder-display").first().find(".js-address").length : $(".js-employment-addresses-holder-display").first().find(".js-employment").length === 0 ? 0 : $(".js-employment-addresses-holder-display").first().find(".js-employment").length;
    var f = $(u.find('[id*="building"]')[0]), s = u.find('[id*="buildingNumber"]'), h = u.find('[id*="buildingName"]'),
        p = u.find('[id*="subBuildingName"]'), l = u.find('[id*="organisationName"]'), w = u.find('[id*="country"]'),
        b = u.find('[id*="countryCode"]'), e = u.find('[id*="street"]'), k = u.find('[id*="county"]'),
        o = u.find('[id*="town"]'), d = i.find('[id*="postcode"]'),
        g = u.find('.postcode-years-months-row [id*="address-postcode"]'),
        a = u.find('.postcode-years-months-row [id*="address-years"]'),
        v = u.find('.postcode-years-months-row [id*="address-months"]');
    if ($(f).attr("id").substr($(f).attr("id").length - 8, $(f).attr("id").length) == "building" && f.val(), s.val(n.TempBuildingNumber), h.val(n.TempBuildingName), p.val(n.SubBuilding), l.val(n.OrganisationName), w.val(n.Country), b.val(n.CountryCode), e.val(n.PrimaryStreet), k.val(n.County === "" ? n.PostTown : n.County), o.val(n.PostTown), ot = ($(h).val() != null || $(s).val() != null) && $(e).val() != null && $(k).val() != null && $(o).val() != null && $(d).val() != null && ($(h).val().length > 0 || $(s).val().length > 0) && $(e).val().length > 0 && $(k).val().length > 0 && $(o).val().length > 0 && $(d).val().length > 0, ot) {
        var nt = "", ft = "", tt = "", et = "";
        r == "Addresses" ? (nt = $("#address-display-template").html(), ft = Handlebars.compile(nt), tt = $("#addresses-template").html(), et = Handlebars.compile(tt)) : (nt = $("#employment-display-template").html(), ft = Handlebars.compile(nt), tt = $("#employment-template").html(), et = Handlebars.compile(tt));
        it = {
            index: c,
            building: f.val(),
            buildingNumber: s.val(),
            buildingName: h.val(),
            subBuildingName: p.val(),
            organisationName: l.val(),
            country: w.val(),
            countryCode: b.val(),
            street: e.val(),
            town: o.val(),
            county: k.val(),
            postcode: d.val(),
            years: a.val() || a.attr("value"),
            months: v.val() || v.attr("value")
        };
        i.find(".js-btn-next").data("check-additional-employment-history") && (it = {
            index: c,
            building: f.val(),
            buildingNumber: s.val(),
            buildingName: h.val(),
            subBuildingName: p.val(),
            organisationName: l.val(),
            country: w.val(),
            countryCode: b.val(),
            street: e.val(),
            town: o.val(),
            county: k.val(),
            postcode: d.val(),
            employmentstatus: $('.js-additional-employment-data-section [name="Employment[' + c + '].EmploymentStatus"]').val(),
            employer: $('.js-additional-employment-data-section [name="Employment[' + c + '].Employer"]').val(),
            jobtitle: $('.js-additional-employment-data-section [name="Employment[' + c + '].JobTitle"]').val(),
            years: $('.js-additional-employment-data-section [name="Employment[' + c + '].TimeAtEmployerYears"]').val(),
            months: $('.js-additional-employment-data-section [name="Employment[' + c + '].TimeAtEmployerMonths"]').val()
        });
        rt = ft(it);
        ut = et(it);
        r == "Addresses" ? (i.find(".js-addresses-holder-display").append(rt), i.find(".js-address-inputs").append(ut), i.find(".js-addresses-container-display").show()) : (i.find(".js-employment-addresses-holder-display").first().append(rt), i.find(".js-employment-addresses-holder-display").length == 0 && $(".js-employment-addresses-holder-display").first().append(rt), $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-check-additional-employment-history") == "true" && (i.find(".js-employment-inputs").append(ut), i.find(".js-employment-inputs").length == 0 && $(".js-employment-inputs").append(ut)), i.find(".js-employment-addresses-container-display").show());
        i.find(".postcode-entry").hide();
        r == "Addresses" ? i.find(".js-addresses-container-display").show() : i.find(".js-employment-addresses-container-display").show();
        i.find(".js-address").length === 2 && $("#step10-postcode-entry-form h2").text("");
        r == "Addressses" ? i.find(".js-btn-next").removeAttr("data-add-manual-address-active").removeData("add-manual-address-active") : i.find(".js-btn-next").removeAttr("data-add-manual-employment-addresses-active").removeData("add-manual-employment-addresses-active");
        i.find(".manual-address").hide();
        i.find(".manual-address-only").show();
        st($(".progress-container"));
        $(document).off("click", ".edit-address");
        $(document).on("click", ".edit-address", function () {
            var n = $(this).data("index"), u;
            f.val("");
            s.val("");
            h.val("");
            l.val("");
            subBuildingName.Element.val("");
            e.val("");
            o.val("");
            g.val("");
            a.val("");
            v.val("");
            var t = i.find('[class*="address-inputs"]'),
                d = t.children('input[name="' + r + "[" + n + '].Building"]').val(),
                nt = t.children('input[name="' + r + "[" + n + '].BuildingNumber"]').val(),
                tt = t.children('input[name="' + r + "[" + n + '].BuildingName"]').val(),
                it = t.children('input[name="' + r + "[" + n + '].SubBuildingName"]').val(),
                rt = t.children('input[name="' + r + "[" + n + '].OrganisationName"]').val(),
                ut = t.children('input[name="' + r + "[" + n + '].Country"]').val(),
                ft = t.children('input[name="' + r + "[" + n + '].CountryCode"]').val(),
                et = t.children('input[name="' + r + "[" + n + '].Street"]').val(),
                ot = t.children('input[name="' + r + "[" + n + '].Town"]').val(),
                st = t.children('input[name="' + r + "[" + n + '].County"]').val(),
                c = t.children('input[name="' + r + "[" + n + '].Postcode"]').val(),
                y = t.children('input[name="' + r + "[" + n + '].TimeAtAddressYears"]').val(),
                k = t.children('input[name="' + r + "[" + n + '].TimeAtAddressMonths"]').val();
            f.val(d);
            s.val(nt);
            h.val(tt);
            l.val(rt);
            p.val(it);
            w.val(ut);
            b.val(ft);
            e.val(et);
            o.val(ot);
            g.val(c);
            a.val(y);
            v.val(k);
            i.find(".postcode-entry").hide();
            i.find(".manual-address").show();
            c != null && y.length > 0 && k.length > 0 ? i.find(".postcode-years-months-row").show() : i.find(".postcode-years-months-row").hide();
            i.find(".js-btn-next").attr("disabled", !0);
            u = $(".update-address-row");
            u.find(".update-current-address-btn").attr("data-index", n);
            u.show()
        });
        $(".update-current-address-btn").off("click");
        $(".update-current-address-btn").on("click", function () {
            var n = $(this).data("index"), t;
            a.val().length === 0 && v.val().length === 0 ? ($(".js-address-" + n + " span").html(f.val() + ", " + e.val() + ", " + o.val() + ", " + d.val()), t = $(".js-address-inputs"), t.children('input[name="Addresses[' + n + '].Building"]').val(f.val()), t.children('input[name="Addresses[' + n + '].BuildingNumber"]').val(s.val()), t.children('input[name="Addresses[' + n + '].BuildingName"]').val(h.val()), t.children('input[name="Addresses[' + n + '].OrganisationName"]').val(l.val()), t.children('input[name="Addresses[' + n + '].SubBuildingName"]').val(p.val()), t.children('input[name="Addresses[' + n + '].Country"]').val(w.val()), t.children('input[name="Addresses[' + n + '].CountryCode"]').val(b.val()), t.children('input[name="Addresses[' + n + '].Street"]').val(e.val()), t.children('input[name="Addresses[' + n + '].Town"]').val(o.val())) : a.val() != null && v.val() != null && ($(".js-address-" + n + " span").html(f.val() + ", " + e.val() + ", " + o.val() + ", " + g.val()), t = $(".js-address-inputs"), t.children('input[name="Addresses[' + n + '].Building"]').val(f.val()), t.children('input[name="Addresses[' + n + '].BuildingNumber"]').val(s.val()), t.children('input[name="Addresses[' + n + '].BuildingName"]').val(h.val()), t.children('input[name="Addresses[' + n + '].OrganisationName"]').val(l.val()), t.children('input[name="Addresses[' + n + '].SubBuildingName"]').val(subBuildingName.val()), t.children('input[name="Addresses[' + n + '].Country"]').val(country.val()), t.children('input[name="Addresses[' + n + '].CountryCode"]').val(countryCode.val()), t.children('input[name="Addresses[' + n + '].Street"]').val(e.val()), t.children('input[name="Addresses[' + n + '].Town"]').val(o.val()), t.children('input[name="Addresses[' + n + '].Postcode"]').val(g.val()), t.children('input[name="Addresses[' + n + '].TimeAtAddressYears"]').val(a.val()), t.children('input[name="Addresses[' + n + '].TimeAtAddressMonths"]').val(v.val()), $(".js-address").length === 2 ? $(".postcode-entry").hide() : $(".postcode-entry").show());
            $(".manual-address").hide();
            $(".manual-address-only").show();
            $(".postcode-years-months-row").hide();
            $("#step10-postcode-entry-form").find(".js-btn-next").attr("disabled", !1);
            $(this).removeData("index")
        })
    } else $(t).show(), r == "Addresses" ? u.parents(".js-form-area").find(".js-btn-next").attr("data-add-manual-address-active", "true") : $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-check-additional-employment-history") == "true" ? $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-add-employment", !0) : u.parents(".js-form-area").find(".js-btn-next").attr("data-add-manual-employment-address-active", "true");
    setHeightIframe()
}

function searchForManyAddresses(n, t, i, r, u, f) {
    $(u).prop("disabled", !0);
    $.ajax({
        cache: !0,  
        url: "https://api.ideal-postcodes.co.uk/v1/postcodes/" + n + "?api_key=ak_klg4tul5n2pJwOEgDy88cLpVSI0rj",
        url: document.location.protocol + "/postcodelookup/searchmany",
        data: "postcode=" + n + "&source=" + $('input[name="Referrer"]').val(),
        success: function (n) {
            if (($(u).prop("disabled", !1), n.length === 0 || typeof n[0].Error != "undefined"))
                $(r).show(),
                    $("#step10-postcode-entry-form").find(".js-btn-next").attr("data-add-manual-address-active", "true"),
                    $(f).show(),
                    i.hide(),
                    setHeightIframe(),
                    setTimeout(function () {
                        setHeightIframe();
                    }, 500);
            else {
                $(f).hide();
                populateAddressList(n, t);
                $(i).show();
                $(t)
                    .unbind("change")
                    .on("change", function () {
                        this.value !== "" ? searchForSingleAddress(this.value, r) : $(r).hide();
                    });
            }
        },
        error: function () {
            $(r).show();
            $(f).show();
            setHeightIframe();
            setTimeout(function () {
                setHeightIframe();
            }, 500);
        },
        dataType: "jsonp",
        timeout: 8e3,
    });
}
function areaIsValid(n) {
    var t = $(n);
    return t.validator("validate"), !t.data("bs.validator").hasErrors() && !t.data("bs.validator").isIncomplete();
}
function populateAddressList(n, t) {
    $(t).find("option:gt(0)").remove();
    $(n).each(function () {
        var n = this;
        $(t).append(
            $("<option></option>")
                .attr("value", n.Id)
                .text(n.StreetAddress + " " + n.Place)
        );
    });
    setHeightIframe();
    setTimeout(function () {
        setHeightIframe();
    }, 500);
}
function searchForSingleAddress(n, t) {
    $.ajax({
        cache: !0,
        url: document.location.protocol + "/postcodelookup/searchunique",
        data: "id=" + n,
        success: function (n) {
            n.length > 0 && populateManualAddress(n[0], t);
        },
        error: function () {
            $(t).show();
            $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-check-additional-employment-history") == "true" &&
                ($(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-add-employment", !0),
                $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-add-manual-employment-active", !0),
                $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").removeAttr("data-add-manual-employment-address-active"));
            setHeightIframe();
            setTimeout(function () {
                setHeightIframe();
            }, 500);
        },
        dataType: "jsonp",
        timeout: 8e3,
    });
}
function populateManualAddress(n, t) {
    var y, u, ot, it, rt, ut;
    try {
        console.log("Address result");
        console.dir(n);
    } catch (ht) {}
    y = n.BuildingNumber;
    u = $(t);
    n.SubBuilding !== "" && (y = n.SubBuilding + ", " + y);
    y.length === 0 && (y = n.Line1);
    var st = function (n) {
            if (typeof n.offset() != "undefined") {
                var t = n.offset();
                $("html, body").animate({ scrollTop: t.top }, 100);
            }
        },
        r = u.parents(".js-form-area").attr("id").indexOf("employment") > -1 ? "Employment" : "Addresses",
        i = u.parents(".js-form-area"),
        c =
            r == "Addresses"
                ? $(".js-addresses-holder-display").first().find(".js-address").length === 0
                    ? 0
                    : $(".js-addresses-holder-display").first().find(".js-address").length
                : $(".js-employment-addresses-holder-display").first().find(".js-employment").length === 0
                ? 0
                : $(".js-employment-addresses-holder-display").first().find(".js-employment").length;
    var f = $(u.find('[id*="building"]')[0]),
        s = u.find('[id*="buildingNumber"]'),
        h = u.find('[id*="buildingName"]'),
        p = u.find('[id*="subBuildingName"]'),
        l = u.find('[id*="organisationName"]'),
        w = u.find('[id*="country"]'),
        b = u.find('[id*="countryCode"]'),
        e = u.find('[id*="street"]'),
        k = u.find('[id*="county"]'),
        o = u.find('[id*="town"]'),
        d = i.find('[id*="postcode"]'),
        g = u.find('.postcode-years-months-row [id*="address-postcode"]'),
        a = u.find('.postcode-years-months-row [id*="address-years"]'),
        v = u.find('.postcode-years-months-row [id*="address-months"]');
    if (
        ($(f)
            .attr("id")
            .substr($(f).attr("id").length - 8, $(f).attr("id").length) == "building" && f.val(),
        s.val(n.TempBuildingNumber),
        h.val(n.TempBuildingName),
        p.val(n.SubBuilding),
        l.val(n.OrganisationName),
        w.val(n.Country),
        b.val(n.CountryCode),
        e.val(n.PrimaryStreet),
        k.val(n.County === "" ? n.PostTown : n.County),
        o.val(n.PostTown),
        (ot =
            ($(h).val() != null || $(s).val() != null) &&
            $(e).val() != null &&
            $(k).val() != null &&
            $(o).val() != null &&
            $(d).val() != null &&
            ($(h).val().length > 0 || $(s).val().length > 0) &&
            $(e).val().length > 0 &&
            $(k).val().length > 0 &&
            $(o).val().length > 0 &&
            $(d).val().length > 0),
        ot)
    ) {
        var nt = "",
            ft = "",
            tt = "",
            et = "";
        r == "Addresses"
            ? ((nt = $("#address-display-template").html()), (ft = Handlebars.compile(nt)), (tt = $("#addresses-template").html()), (et = Handlebars.compile(tt)))
            : ((nt = $("#employment-display-template").html()), (ft = Handlebars.compile(nt)), (tt = $("#employment-template").html()), (et = Handlebars.compile(tt)));
        it = {
            index: c,
            building: f.val(),
            buildingNumber: s.val(),
            buildingName: h.val(),
            subBuildingName: p.val(),
            organisationName: l.val(),
            country: w.val(),
            countryCode: b.val(),
            street: e.val(),
            town: o.val(),
            county: k.val(),
            postcode: d.val(),
            years: a.val() || a.attr("value"),
            months: v.val() || v.attr("value"),
        };
        i.find(".js-btn-next").data("check-additional-employment-history") &&
            (it = {
                index: c,
                building: f.val(),
                buildingNumber: s.val(),
                buildingName: h.val(),
                subBuildingName: p.val(),
                organisationName: l.val(),
                country: w.val(),
                countryCode: b.val(),
                street: e.val(),
                town: o.val(),
                county: k.val(),
                postcode: d.val(),
                employmentstatus: $('.js-additional-employment-data-section [name="Employment[' + c + '].EmploymentStatus"]').val(),
                employer: $('.js-additional-employment-data-section [name="Employment[' + c + '].Employer"]').val(),
                jobtitle: $('.js-additional-employment-data-section [name="Employment[' + c + '].JobTitle"]').val(),
                years: $('.js-additional-employment-data-section [name="Employment[' + c + '].TimeAtEmployerYears"]').val(),
                months: $('.js-additional-employment-data-section [name="Employment[' + c + '].TimeAtEmployerMonths"]').val(),
            });
        rt = ft(it);
        ut = et(it);
        r == "Addresses"
            ? (i.find(".js-addresses-holder-display").append(rt), i.find(".js-address-inputs").append(ut), i.find(".js-addresses-container-display").show())
            : (i.find(".js-employment-addresses-holder-display").first().append(rt),
              i.find(".js-employment-addresses-holder-display").length == 0 && $(".js-employment-addresses-holder-display").first().append(rt),
              $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-check-additional-employment-history") == "true" &&
                  (i.find(".js-employment-inputs").append(ut), i.find(".js-employment-inputs").length == 0 && $(".js-employment-inputs").append(ut)),
              i.find(".js-employment-addresses-container-display").show());
        i.find(".postcode-entry").hide();
        r == "Addresses" ? i.find(".js-addresses-container-display").show() : i.find(".js-employment-addresses-container-display").show();
        i.find(".js-address").length === 2 && $("#step10-postcode-entry-form h2").text("");
        r == "Addressses"
            ? i.find(".js-btn-next").removeAttr("data-add-manual-address-active").removeData("add-manual-address-active")
            : i.find(".js-btn-next").removeAttr("data-add-manual-employment-addresses-active").removeData("add-manual-employment-addresses-active");
        i.find(".manual-address").hide();
        i.find(".manual-address-only").show();
        st($(".progress-container"));
        $(document).off("click", ".edit-address");
        $(document).on("click", ".edit-address", function () {
            var n = $(this).data("index"),
                u;
            f.val("");
            s.val("");
            h.val("");
            l.val("");
            subBuildingName.Element.val("");
            e.val("");
            o.val("");
            g.val("");
            a.val("");
            v.val("");
            var t = i.find('[class*="address-inputs"]'),
                d = t.children('input[name="' + r + "[" + n + '].Building"]').val(),
                nt = t.children('input[name="' + r + "[" + n + '].BuildingNumber"]').val(),
                tt = t.children('input[name="' + r + "[" + n + '].BuildingName"]').val(),
                it = t.children('input[name="' + r + "[" + n + '].SubBuildingName"]').val(),
                rt = t.children('input[name="' + r + "[" + n + '].OrganisationName"]').val(),
                ut = t.children('input[name="' + r + "[" + n + '].Country"]').val(),
                ft = t.children('input[name="' + r + "[" + n + '].CountryCode"]').val(),
                et = t.children('input[name="' + r + "[" + n + '].Street"]').val(),
                ot = t.children('input[name="' + r + "[" + n + '].Town"]').val(),
                st = t.children('input[name="' + r + "[" + n + '].County"]').val(),
                c = t.children('input[name="' + r + "[" + n + '].Postcode"]').val(),
                y = t.children('input[name="' + r + "[" + n + '].TimeAtAddressYears"]').val(),
                k = t.children('input[name="' + r + "[" + n + '].TimeAtAddressMonths"]').val();
            f.val(d);
            s.val(nt);
            h.val(tt);
            l.val(rt);
            p.val(it);
            w.val(ut);
            b.val(ft);
            e.val(et);
            o.val(ot);
            g.val(c);
            a.val(y);
            v.val(k);
            i.find(".postcode-entry").hide();
            i.find(".manual-address").show();
            c != null && y.length > 0 && k.length > 0 ? i.find(".postcode-years-months-row").show() : i.find(".postcode-years-months-row").hide();
            i.find(".js-btn-next").attr("disabled", !0);
            u = $(".update-address-row");
            u.find(".update-current-address-btn").attr("data-index", n);
            u.show();
        });
        $(".update-current-address-btn").off("click");
        $(".update-current-address-btn").on("click", function () {
            var n = $(this).data("index"),
                t;
            a.val().length === 0 && v.val().length === 0
                ? ($(".js-address-" + n + " span").html(f.val() + ", " + e.val() + ", " + o.val() + ", " + d.val()),
                  (t = $(".js-address-inputs")),
                  t.children('input[name="Addresses[' + n + '].Building"]').val(f.val()),
                  t.children('input[name="Addresses[' + n + '].BuildingNumber"]').val(s.val()),
                  t.children('input[name="Addresses[' + n + '].BuildingName"]').val(h.val()),
                  t.children('input[name="Addresses[' + n + '].OrganisationName"]').val(l.val()),
                  t.children('input[name="Addresses[' + n + '].SubBuildingName"]').val(p.val()),
                  t.children('input[name="Addresses[' + n + '].Country"]').val(w.val()),
                  t.children('input[name="Addresses[' + n + '].CountryCode"]').val(b.val()),
                  t.children('input[name="Addresses[' + n + '].Street"]').val(e.val()),
                  t.children('input[name="Addresses[' + n + '].Town"]').val(o.val()))
                : a.val() != null &&
                  v.val() != null &&
                  ($(".js-address-" + n + " span").html(f.val() + ", " + e.val() + ", " + o.val() + ", " + g.val()),
                  (t = $(".js-address-inputs")),
                  t.children('input[name="Addresses[' + n + '].Building"]').val(f.val()),
                  t.children('input[name="Addresses[' + n + '].BuildingNumber"]').val(s.val()),
                  t.children('input[name="Addresses[' + n + '].BuildingName"]').val(h.val()),
                  t.children('input[name="Addresses[' + n + '].OrganisationName"]').val(l.val()),
                  t.children('input[name="Addresses[' + n + '].SubBuildingName"]').val(subBuildingName.val()),
                  t.children('input[name="Addresses[' + n + '].Country"]').val(country.val()),
                  t.children('input[name="Addresses[' + n + '].CountryCode"]').val(countryCode.val()),
                  t.children('input[name="Addresses[' + n + '].Street"]').val(e.val()),
                  t.children('input[name="Addresses[' + n + '].Town"]').val(o.val()),
                  t.children('input[name="Addresses[' + n + '].Postcode"]').val(g.val()),
                  t.children('input[name="Addresses[' + n + '].TimeAtAddressYears"]').val(a.val()),
                  t.children('input[name="Addresses[' + n + '].TimeAtAddressMonths"]').val(v.val()),
                  $(".js-address").length === 2 ? $(".postcode-entry").hide() : $(".postcode-entry").show());
            $(".manual-address").hide();
            $(".manual-address-only").show();
            $(".postcode-years-months-row").hide();
            $("#step10-postcode-entry-form").find(".js-btn-next").attr("disabled", !1);
            $(this).removeData("index");
        });
    } else
        $(t).show(),
            r == "Addresses"
                ? u.parents(".js-form-area").find(".js-btn-next").attr("data-add-manual-address-active", "true")
                : $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-check-additional-employment-history") == "true"
                ? $(t).parents("#additional-employment-postcode-entry-form").find(".js-btn-next").attr("data-add-employment", !0)
                : u.parents(".js-form-area").find(".js-btn-next").attr("data-add-manual-employment-address-active", "true");
    setHeightIframe();
}



function hideInputsFromQuerystring(n) {
    for (var i = n.split("&"), u = [], t = 0; t < i.length; t++) {
        var r = i[t].split("="), f = decodeURIComponent(r[0]), e = decodeURIComponent(r[1]);
        e.length > 0 && u.push(f)
    }
}

function isDropdown(n) {
    return $('select[name="' + n + '"]').length > 0
}

function existsInDropdown(n, t) {
    var i = !1;
    return $('select[name="' + n + '"] option').each(function () {
        this.value == t && (i = !0)
    }), i
}

var formIdleTime, stepsVisible, updateFormStepLabel, querystring, getBenefitsBreakdownStep, makeDoubleDigit,
    dobButtonsFunc, vehicleTypeAPIChoices;
!function (n, t) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = n.document ? t(n, !0) : function (n) {
        if (!n.document) throw new Error("jQuery requires a window with a document");
        return t(n)
    } : t(n)
}("undefined" != typeof window ? window : this, function (n, t) {
    function ri(n) {
        var t = n.length, r = i.type(n);
        return "function" === r || i.isWindow(n) ? !1 : 1 === n.nodeType && t ? !0 : "array" === r || 0 === t || "number" == typeof t && t > 0 && t - 1 in n
    }

    function ui(n, t, r) {
        if (i.isFunction(t)) return i.grep(n, function (n, i) {
            return !!t.call(n, i, n) !== r
        });
        if (t.nodeType) return i.grep(n, function (n) {
            return n === t !== r
        });
        if ("string" == typeof t) {
            if (re.test(t)) return i.filter(t, n, r);
            t = i.filter(t, n)
        }
        return i.grep(n, function (n) {
            return i.inArray(n, t) >= 0 !== r
        })
    }

    function hr(n, t) {
        do n = n[t]; while (n && 1 !== n.nodeType);
        return n
    }

    function ee(n) {
        var t = fi[n] = {};
        return i.each(n.match(h) || [], function (n, i) {
            t[i] = !0
        }), t
    }

    function cr() {
        u.addEventListener ? (u.removeEventListener("DOMContentLoaded", a, !1), n.removeEventListener("load", a, !1)) : (u.detachEvent("onreadystatechange", a), n.detachEvent("onload", a))
    }

    function a() {
        (u.addEventListener || "load" === event.type || "complete" === u.readyState) && (cr(), i.ready())
    }

    function yr(n, t, r) {
        if (void 0 === r && 1 === n.nodeType) {
            var u = "data-" + t.replace(vr, "-$1").toLowerCase();
            if (r = n.getAttribute(u), "string" == typeof r) {
                try {
                    r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : ar.test(r) ? i.parseJSON(r) : r
                } catch (f) {
                }
                i.data(n, t, r)
            } else r = void 0
        }
        return r
    }

    function ei(n) {
        for (var t in n) if (("data" !== t || !i.isEmptyObject(n[t])) && "toJSON" !== t) return !1;
        return !0
    }

    function pr(n, t, r, u) {
        if (i.acceptData(n)) {
            var s, e, h = i.expando, l = n.nodeType, o = l ? i.cache : n, f = l ? n[h] : n[h] && h;
            if (f && o[f] && (u || o[f].data) || void 0 !== r || "string" != typeof t) return f || (f = l ? n[h] = c.pop() || i.guid++ : h), o[f] || (o[f] = l ? {} : { toJSON: i.noop }), ("object" == typeof t || "function" == typeof t) && (u ? o[f] = i.extend(o[f], t) : o[f].data = i.extend(o[f].data, t)), e = o[f], u || (e.data || (e.data = {}), e = e.data), void 0 !== r && (e[i.camelCase(t)] = r), "string" == typeof t ? (s = e[t], null == s && (s = e[i.camelCase(t)])) : s = e, s
        }
    }

    function wr(n, t, u) {
        if (i.acceptData(n)) {
            var o, s, h = n.nodeType, f = h ? i.cache : n, e = h ? n[i.expando] : i.expando;
            if (f[e]) {
                if (t && (o = u ? f[e] : f[e].data)) {
                    for (i.isArray(t) ? t = t.concat(i.map(t, i.camelCase)) : (t in o) ? t = [t] : (t = i.camelCase(t), t = (t in o) ? [t] : t.split(" ")), s = t.length; s--;) delete o[t[s]];
                    if (u ? !ei(o) : !i.isEmptyObject(o)) return
                }
                (u || (delete f[e].data, ei(f[e]))) && (h ? i.cleanData([n], !0) : r.deleteExpando || f != f.window ? delete f[e] : f[e] = null)
            }
        }
    }

    function vt() {
        return !0
    }

    function it() {
        return !1
    }

    function dr() {
        try {
            return u.activeElement
        } catch (n) {
        }
    }

    function gr(n) {
        var i = nu.split("|"), t = n.createDocumentFragment();
        if (t.createElement) while (i.length) t.createElement(i.pop());
        return t
    }

    function f(n, t) {
        var e, u, s = 0,
            r = typeof n.getElementsByTagName !== o ? n.getElementsByTagName(t || "*") : typeof n.querySelectorAll !== o ? n.querySelectorAll(t || "*") : void 0;
        if (!r) for (r = [], e = n.childNodes || n; null != (u = e[s]); s++) !t || i.nodeName(u, t) ? r.push(u) : i.merge(r, f(u, t));
        return void 0 === t || t && i.nodeName(n, t) ? i.merge([n], r) : r
    }

    function we(n) {
        oi.test(n.type) && (n.defaultChecked = n.checked)
    }

    function eu(n, t) {
        return i.nodeName(n, "table") && i.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? n.getElementsByTagName("tbody")[0] || n.appendChild(n.ownerDocument.createElement("tbody")) : n
    }

    function ou(n) {
        return n.type = (null !== i.find.attr(n, "type")) + "/" + n.type, n
    }

    function su(n) {
        var t = ve.exec(n.type);
        return t ? n.type = t[1] : n.removeAttribute("type"), n
    }

    function li(n, t) {
        for (var u, r = 0; null != (u = n[r]); r++) i._data(u, "globalEval", !t || i._data(t[r], "globalEval"))
    }

    function hu(n, t) {
        if (1 === t.nodeType && i.hasData(n)) {
            var u, f, o, s = i._data(n), r = i._data(t, s), e = s.events;
            if (e) {
                delete r.handle;
                r.events = {};
                for (u in e) for (f = 0, o = e[u].length; o > f; f++) i.event.add(t, u, e[u][f])
            }
            r.data && (r.data = i.extend({}, r.data))
        }
    }

    function be(n, t) {
        var u, e, f;
        if (1 === t.nodeType) {
            if (u = t.nodeName.toLowerCase(), !r.noCloneEvent && t[i.expando]) {
                f = i._data(t);
                for (e in f.events) i.removeEvent(t, e, f.handle);
                t.removeAttribute(i.expando)
            }
            "script" === u && t.text !== n.text ? (ou(t).text = n.text, su(t)) : "object" === u ? (t.parentNode && (t.outerHTML = n.outerHTML), r.html5Clone && n.innerHTML && !i.trim(t.innerHTML) && (t.innerHTML = n.innerHTML)) : "input" === u && oi.test(n.type) ? (t.defaultChecked = t.checked = n.checked, t.value !== n.value && (t.value = n.value)) : "option" === u ? t.defaultSelected = t.selected = n.defaultSelected : ("input" === u || "textarea" === u) && (t.defaultValue = n.defaultValue)
        }
    }

    function cu(t, r) {
        var f, u = i(r.createElement(t)).appendTo(r.body),
            e = n.getDefaultComputedStyle && (f = n.getDefaultComputedStyle(u[0])) ? f.display : i.css(u[0], "display");
        return u.detach(), e
    }

    function yt(n) {
        var r = u, t = ai[n];
        return t || (t = cu(n, r), "none" !== t && t || (ot = (ot || i("<iframe frameborder='0' width='0' height='0'/>")).appendTo(r.documentElement), r = (ot[0].contentWindow || ot[0].contentDocument).document, r.write(), r.close(), t = cu(n, r), ot.detach()), ai[n] = t), t
    }

    function au(n, t) {
        return {
            get: function () {
                var i = n();
                if (null != i) return i ? void delete this.get : (this.get = t).apply(this, arguments)
            }
        }
    }

    function pu(n, t) {
        if (t in n) return t;
        for (var r = t.charAt(0).toUpperCase() + t.slice(1), u = t, i = yu.length; i--;) if (t = yu[i] + r, t in n) return t;
        return u
    }

    function wu(n, t) {
        for (var f, r, o, e = [], u = 0, s = n.length; s > u; u++) r = n[u], r.style && (e[u] = i._data(r, "olddisplay"), f = r.style.display, t ? (e[u] || "none" !== f || (r.style.display = ""), "" === r.style.display && et(r) && (e[u] = i._data(r, "olddisplay", yt(r.nodeName)))) : (o = et(r), (f && "none" !== f || !o) && i._data(r, "olddisplay", o ? f : i.css(r, "display"))));
        for (u = 0; s > u; u++) r = n[u], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? e[u] || "" : "none"));
        return n
    }

    function bu(n, t, i) {
        var r = no.exec(t);
        return r ? Math.max(0, r[1] - (i || 0)) + (r[2] || "px") : t
    }

    function ku(n, t, r, u, f) {
        for (var e = r === (u ? "border" : "content") ? 4 : "width" === t ? 1 : 0, o = 0; 4 > e; e += 2) "margin" === r && (o += i.css(n, r + w[e], !0, f)), u ? ("content" === r && (o -= i.css(n, "padding" + w[e], !0, f)), "margin" !== r && (o -= i.css(n, "border" + w[e] + "Width", !0, f))) : (o += i.css(n, "padding" + w[e], !0, f), "padding" !== r && (o += i.css(n, "border" + w[e] + "Width", !0, f)));
        return o
    }

    function du(n, t, u) {
        var o = !0, f = "width" === t ? n.offsetWidth : n.offsetHeight, e = k(n),
            s = r.boxSizing && "border-box" === i.css(n, "boxSizing", !1, e);
        if (0 >= f || null == f) {
            if (f = d(n, t, e), (0 > f || null == f) && (f = n.style[t]), pt.test(f)) return f;
            o = s && (r.boxSizingReliable() || f === n.style[t]);
            f = parseFloat(f) || 0
        }
        return f + ku(n, t, u || (s ? "border" : "content"), o, e) + "px"
    }

    function e(n, t, i, r, u) {
        return new e.prototype.init(n, t, i, r, u)
    }

    function nf() {
        return setTimeout(function () {
            rt = void 0
        }), rt = i.now()
    }

    function kt(n, t) {
        var r, i = { height: n }, u = 0;
        for (t = t ? 1 : 0; 4 > u; u += 2 - t) r = w[u], i["margin" + r] = i["padding" + r] = n;
        return t && (i.opacity = i.width = n), i
    }

    function tf(n, t, i) {
        for (var u, f = (st[t] || []).concat(st["*"]), r = 0, e = f.length; e > r; r++) if (u = f[r].call(i, t, n)) return u
    }

    function fo(n, t, u) {
        var f, a, p, v, s, w, h, b, l = this, y = {}, o = n.style, c = n.nodeType && et(n), e = i._data(n, "fxshow");
        u.queue || (s = i._queueHooks(n, "fx"), null == s.unqueued && (s.unqueued = 0, w = s.empty.fire, s.empty.fire = function () {
            s.unqueued || w()
        }), s.unqueued++ , l.always(function () {
            l.always(function () {
                s.unqueued--;
                i.queue(n, "fx").length || s.empty.fire()
            })
        }));
        1 === n.nodeType && ("height" in t || "width" in t) && (u.overflow = [o.overflow, o.overflowX, o.overflowY], h = i.css(n, "display"), b = "none" === h ? i._data(n, "olddisplay") || yt(n.nodeName) : h, "inline" === b && "none" === i.css(n, "float") && (r.inlineBlockNeedsLayout && "inline" !== yt(n.nodeName) ? o.zoom = 1 : o.display = "inline-block"));
        u.overflow && (o.overflow = "hidden", r.shrinkWrapBlocks() || l.always(function () {
            o.overflow = u.overflow[0];
            o.overflowX = u.overflow[1];
            o.overflowY = u.overflow[2]
        }));
        for (f in t) if (a = t[f], ro.exec(a)) {
            if (delete t[f], p = p || "toggle" === a, a === (c ? "hide" : "show")) {
                if ("show" !== a || !e || void 0 === e[f]) continue;
                c = !0
            }
            y[f] = e && e[f] || i.style(n, f)
        } else h = void 0;
        if (i.isEmptyObject(y)) "inline" === ("none" === h ? yt(n.nodeName) : h) && (o.display = h); else {
            e ? "hidden" in e && (c = e.hidden) : e = i._data(n, "fxshow", {});
            p && (e.hidden = !c);
            c ? i(n).show() : l.done(function () {
                i(n).hide()
            });
            l.done(function () {
                var t;
                i._removeData(n, "fxshow");
                for (t in y) i.style(n, t, y[t])
            });
            for (f in y) v = tf(c ? e[f] : 0, f, l), f in e || (e[f] = v.start, c && (v.end = v.start, v.start = "width" === f || "height" === f ? 1 : 0))
        }
    }

    function eo(n, t) {
        var r, f, e, u, o;
        for (r in n) if (f = i.camelCase(r), e = t[f], u = n[r], i.isArray(u) && (e = u[1], u = n[r] = u[0]), r !== f && (n[f] = u, delete n[r]), o = i.cssHooks[f], o && "expand" in o) {
            u = o.expand(u);
            delete n[f];
            for (r in u) r in n || (n[r] = u[r], t[r] = e)
        } else t[f] = e
    }

    function rf(n, t, r) {
        var h, e, o = 0, l = bt.length, f = i.Deferred().always(function () {
            delete c.elem
        }), c = function () {
            if (e) return !1;
            for (var s = rt || nf(), t = Math.max(0, u.startTime + u.duration - s), h = t / u.duration || 0, i = 1 - h, r = 0, o = u.tweens.length; o > r; r++) u.tweens[r].run(i);
            return f.notifyWith(n, [u, i, t]), 1 > i && o ? t : (f.resolveWith(n, [u]), !1)
        }, u = f.promise({
            elem: n,
            props: i.extend({}, t),
            opts: i.extend(!0, { specialEasing: {} }, r),
            originalProperties: t,
            originalOptions: r,
            startTime: rt || nf(),
            duration: r.duration,
            tweens: [],
            createTween: function (t, r) {
                var f = i.Tween(n, u.opts, t, r, u.opts.specialEasing[t] || u.opts.easing);
                return u.tweens.push(f), f
            },
            stop: function (t) {
                var i = 0, r = t ? u.tweens.length : 0;
                if (e) return this;
                for (e = !0; r > i; i++) u.tweens[i].run(1);
                return t ? f.resolveWith(n, [u, t]) : f.rejectWith(n, [u, t]), this
            }
        }), s = u.props;
        for (eo(s, u.opts.specialEasing); l > o; o++) if (h = bt[o].call(u, n, s, u.opts)) return h;
        return i.map(s, tf, u), i.isFunction(u.opts.start) && u.opts.start.call(n, u), i.fx.timer(i.extend(c, {
            elem: n,
            anim: u,
            queue: u.opts.queue
        })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }

    function af(n) {
        return function (t, r) {
            "string" != typeof t && (r = t, t = "*");
            var u, f = 0, e = t.toLowerCase().match(h) || [];
            if (i.isFunction(r)) while (u = e[f++]) "+" === u.charAt(0) ? (u = u.slice(1) || "*", (n[u] = n[u] || []).unshift(r)) : (n[u] = n[u] || []).push(r)
        }
    }

    function vf(n, t, r, u) {
        function e(s) {
            var h;
            return f[s] = !0, i.each(n[s] || [], function (n, i) {
                var s = i(t, r, u);
                return "string" != typeof s || o || f[s] ? o ? !(h = s) : void 0 : (t.dataTypes.unshift(s), e(s), !1)
            }), h
        }

        var f = {}, o = n === bi;
        return e(t.dataTypes[0]) || !f["*"] && e("*")
    }

    function ki(n, t) {
        var u, r, f = i.ajaxSettings.flatOptions || {};
        for (r in t) void 0 !== t[r] && ((f[r] ? n : u || (u = {}))[r] = t[r]);
        return u && i.extend(!0, n, u), n
    }

    function ao(n, t, i) {
        for (var o, e, u, f, s = n.contents, r = n.dataTypes; "*" === r[0];) r.shift(), void 0 === e && (e = n.mimeType || t.getResponseHeader("Content-Type"));
        if (e) for (f in s) if (s[f] && s[f].test(e)) {
            r.unshift(f);
            break
        }
        if (r[0] in i) u = r[0]; else {
            for (f in i) {
                if (!r[0] || n.converters[f + " " + r[0]]) {
                    u = f;
                    break
                }
                o || (o = f)
            }
            u = u || o
        }
        if (u) return (u !== r[0] && r.unshift(u), i[u])
    }

    function vo(n, t, i, r) {
        var h, u, f, s, e, o = {}, c = n.dataTypes.slice();
        if (c[1]) for (f in n.converters) o[f.toLowerCase()] = n.converters[f];
        for (u = c.shift(); u;) if (n.responseFields[u] && (i[n.responseFields[u]] = t), !e && r && n.dataFilter && (t = n.dataFilter(t, n.dataType)), e = u, u = c.shift()) if ("*" === u) u = e; else if ("*" !== e && e !== u) {
            if (f = o[e + " " + u] || o["* " + u], !f) for (h in o) if (s = h.split(" "), s[1] === u && (f = o[e + " " + s[0]] || o["* " + s[0]])) {
                f === !0 ? f = o[h] : o[h] !== !0 && (u = s[0], c.unshift(s[1]));
                break
            }
            if (f !== !0) if (f && n.throws) t = f(t); else try {
                t = f(t)
            } catch (l) {
                return { state: "parsererror", error: f ? l : "No conversion from " + e + " to " + u }
            }
        }
        return { state: "success", data: t }
    }

    function di(n, t, r, u) {
        var f;
        if (i.isArray(t)) i.each(t, function (t, i) {
            r || po.test(n) ? u(n, i) : di(n + "[" + ("object" == typeof i ? t : "") + "]", i, r, u)
        }); else if (r || "object" !== i.type(t)) u(n, t); else for (f in t) di(n + "[" + f + "]", t[f], r, u)
    }

    function pf() {
        try {
            return new n.XMLHttpRequest
        } catch (t) {
        }
    }

    function go() {
        try {
            return new n.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {
        }
    }

    function wf(n) {
        return i.isWindow(n) ? n : 9 === n.nodeType ? n.defaultView || n.parentWindow : !1
    }

    var c = [], l = c.slice, ir = c.concat, ii = c.push, rr = c.indexOf, ct = {}, df = ct.toString,
        tt = ct.hasOwnProperty, r = {}, ur = "1.11.1", i = function (n, t) {
            return new i.fn.init(n, t)
        }, gf = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ne = /^-ms-/, te = /-([\da-z])/gi, ie = function (n, t) {
            return t.toUpperCase()
        }, p, or, sr, h, fi, lt, o, lr, ar, vr, ot, ai, uf, ef, of, gt, gi, ti, nr, tr, bf, kf;
    i.fn = i.prototype = {
        jquery: ur, constructor: i, selector: "", length: 0, toArray: function () {
            return l.call(this)
        }, get: function (n) {
            return null != n ? 0 > n ? this[n + this.length] : this[n] : l.call(this)
        }, pushStack: function (n) {
            var t = i.merge(this.constructor(), n);
            return t.prevObject = this, t.context = this.context, t
        }, each: function (n, t) {
            return i.each(this, n, t)
        }, map: function (n) {
            return this.pushStack(i.map(this, function (t, i) {
                return n.call(t, i, t)
            }))
        }, slice: function () {
            return this.pushStack(l.apply(this, arguments))
        }, first: function () {
            return this.eq(0)
        }, last: function () {
            return this.eq(-1)
        }, eq: function (n) {
            var i = this.length, t = +n + (0 > n ? i : 0);
            return this.pushStack(t >= 0 && i > t ? [this[t]] : [])
        }, end: function () {
            return this.prevObject || this.constructor(null)
        }, push: ii, sort: c.sort, splice: c.splice
    };
    i.extend = i.fn.extend = function () {
        var r, e, t, f, o, s, n = arguments[0] || {}, u = 1, c = arguments.length, h = !1;
        for ("boolean" == typeof n && (h = n, n = arguments[u] || {}, u++), "object" == typeof n || i.isFunction(n) || (n = {}), u === c && (n = this, u--); c > u; u++) if (null != (o = arguments[u])) for (f in o) r = n[f], t = o[f], n !== t && (h && t && (i.isPlainObject(t) || (e = i.isArray(t))) ? (e ? (e = !1, s = r && i.isArray(r) ? r : []) : s = r && i.isPlainObject(r) ? r : {}, n[f] = i.extend(h, s, t)) : void 0 !== t && (n[f] = t));
        return n
    };
    i.extend({
        expando: "jQuery" + (ur + Math.random()).replace(/\D/g, ""), isReady: !0, error: function (n) {
            throw new Error(n);
        }, noop: function () {
        }, isFunction: function (n) {
            return "function" === i.type(n)
        }, isArray: Array.isArray || function (n) {
            return "array" === i.type(n)
        }, isWindow: function (n) {
            return null != n && n == n.window
        }, isNumeric: function (n) {
            return !i.isArray(n) && n - parseFloat(n) >= 0
        }, isEmptyObject: function (n) {
            for (var t in n) return !1;
            return !0
        }, isPlainObject: function (n) {
            var t;
            if (!n || "object" !== i.type(n) || n.nodeType || i.isWindow(n)) return !1;
            try {
                if (n.constructor && !tt.call(n, "constructor") && !tt.call(n.constructor.prototype, "isPrototypeOf")) return !1
            } catch (u) {
                return !1
            }
            if (r.ownLast) for (t in n) return tt.call(n, t);
            for (t in n);
            return void 0 === t || tt.call(n, t)
        }, type: function (n) {
            return null == n ? n + "" : "object" == typeof n || "function" == typeof n ? ct[df.call(n)] || "object" : typeof n
        }, globalEval: function (t) {
            t && i.trim(t) && (n.execScript || function (t) {
                n.eval.call(n, t)
            })(t)
        }, camelCase: function (n) {
            return n.replace(ne, "ms-").replace(te, ie)
        }, nodeName: function (n, t) {
            return n.nodeName && n.nodeName.toLowerCase() === t.toLowerCase()
        }, each: function (n, t, i) {
            var u, r = 0, f = n.length, e = ri(n);
            if (i) {
                if (e) {
                    for (; f > r; r++) if (u = t.apply(n[r], i), u === !1) break
                } else for (r in n) if (u = t.apply(n[r], i), u === !1) break
            } else if (e) {
                for (; f > r; r++) if (u = t.call(n[r], r, n[r]), u === !1) break
            } else for (r in n) if (u = t.call(n[r], r, n[r]), u === !1) break;
            return n
        }, trim: function (n) {
            return null == n ? "" : (n + "").replace(gf, "")
        }, makeArray: function (n, t) {
            var r = t || [];
            return null != n && (ri(Object(n)) ? i.merge(r, "string" == typeof n ? [n] : n) : ii.call(r, n)), r
        }, inArray: function (n, t, i) {
            var r;
            if (t) {
                if (rr) return rr.call(t, n, i);
                for (r = t.length, i = i ? 0 > i ? Math.max(0, r + i) : i : 0; r > i; i++) if (i in t && t[i] === n) return i
            }
            return -1
        }, merge: function (n, t) {
            for (var r = +t.length, i = 0, u = n.length; r > i;) n[u++] = t[i++];
            if (r !== r) while (void 0 !== t[i]) n[u++] = t[i++];
            return n.length = u, n
        }, grep: function (n, t, i) {
            for (var u, f = [], r = 0, e = n.length, o = !i; e > r; r++) u = !t(n[r], r), u !== o && f.push(n[r]);
            return f
        }, map: function (n, t, i) {
            var u, r = 0, e = n.length, o = ri(n), f = [];
            if (o) for (; e > r; r++) u = t(n[r], r, i), null != u && f.push(u); else for (r in n) u = t(n[r], r, i), null != u && f.push(u);
            return ir.apply([], f)
        }, guid: 1, proxy: function (n, t) {
            var u, r, f;
            return "string" == typeof t && (f = n[t], t = n, n = f), i.isFunction(n) ? (u = l.call(arguments, 2), r = function () {
                return n.apply(t || this, u.concat(l.call(arguments)))
            }, r.guid = n.guid = n.guid || i.guid++ , r) : void 0
        }, now: function () {
            return +new Date
        }, support: r
    });
    i.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (n, t) {
        ct["[object " + t + "]"] = t.toLowerCase()
    });
    p = function (n) {
        function r(n, t, i, r) {
            var w, h, c, v, k, y, d, l, nt, g;
            if ((t ? t.ownerDocument || t : s) !== e && p(t), t = t || e, i = i || [], !n || "string" != typeof n) return i;
            if (1 !== (v = t.nodeType) && 9 !== v) return [];
            if (a && !r) {
                if (w = sr.exec(n)) if (c = w[1]) {
                    if (9 === v) {
                        if (h = t.getElementById(c), !h || !h.parentNode) return i;
                        if (h.id === c) return i.push(h), i
                    } else if (t.ownerDocument && (h = t.ownerDocument.getElementById(c)) && ot(t, h) && h.id === c) return i.push(h), i
                } else {
                    if (w[2]) return b.apply(i, t.getElementsByTagName(n)), i;
                    if ((c = w[3]) && u.getElementsByClassName && t.getElementsByClassName) return b.apply(i, t.getElementsByClassName(c)), i
                }
                if (u.qsa && (!o || !o.test(n))) {
                    if (l = d = f, nt = t, g = 9 === v && n, 1 === v && "object" !== t.nodeName.toLowerCase()) {
                        for (y = et(n), (d = t.getAttribute("id")) ? l = d.replace(hr, "\\$&") : t.setAttribute("id", l), l = "[id='" + l + "'] ", k = y.length; k--;) y[k] = l + yt(y[k]);
                        nt = gt.test(n) && ii(t.parentNode) || t;
                        g = y.join(",")
                    }
                    if (g) try {
                        return b.apply(i, nt.querySelectorAll(g)), i
                    } catch (tt) {
                    } finally {
                            d || t.removeAttribute("id")
                        }
                }
            }
            return si(n.replace(at, "$1"), t, i, r)
        }

        function ni() {
            function n(r, u) {
                return i.push(r + " ") > t.cacheLength && delete n[i.shift()], n[r + " "] = u
            }

            var i = [];
            return n
        }

        function h(n) {
            return n[f] = !0, n
        }

        function c(n) {
            var t = e.createElement("div");
            try {
                return !!n(t)
            } catch (i) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t);
                t = null
            }
        }

        function ti(n, i) {
            for (var u = n.split("|"), r = n.length; r--;) t.attrHandle[u[r]] = i
        }

        function wi(n, t) {
            var i = t && n,
                r = i && 1 === n.nodeType && 1 === t.nodeType && (~t.sourceIndex || ai) - (~n.sourceIndex || ai);
            if (r) return r;
            if (i) while (i = i.nextSibling) if (i === t) return -1;
            return n ? 1 : -1
        }

        function cr(n) {
            return function (t) {
                var i = t.nodeName.toLowerCase();
                return "input" === i && t.type === n
            }
        }

        function lr(n) {
            return function (t) {
                var i = t.nodeName.toLowerCase();
                return ("input" === i || "button" === i) && t.type === n
            }
        }

        function tt(n) {
            return h(function (t) {
                return t = +t, h(function (i, r) {
                    for (var u, f = n([], i.length, t), e = f.length; e--;) i[u = f[e]] && (i[u] = !(r[u] = i[u]))
                })
            })
        }

        function ii(n) {
            return n && typeof n.getElementsByTagName !== ut && n
        }

        function bi() {
        }

        function yt(n) {
            for (var t = 0, r = n.length, i = ""; r > t; t++) i += n[t].value;
            return i
        }

        function ri(n, t, i) {
            var r = t.dir, u = i && "parentNode" === r, e = ki++;
            return t.first ? function (t, i, f) {
                while (t = t[r]) if (1 === t.nodeType || u) return n(t, i, f)
            } : function (t, i, o) {
                var s, h, c = [v, e];
                if (o) {
                    while (t = t[r]) if ((1 === t.nodeType || u) && n(t, i, o)) return !0
                } else while (t = t[r]) if (1 === t.nodeType || u) {
                    if (h = t[f] || (t[f] = {}), (s = h[r]) && s[0] === v && s[1] === e) return c[2] = s[2];
                    if (h[r] = c, c[2] = n(t, i, o)) return !0
                }
            }
        }

        function ui(n) {
            return n.length > 1 ? function (t, i, r) {
                for (var u = n.length; u--;) if (!n[u](t, i, r)) return !1;
                return !0
            } : n[0]
        }

        function ar(n, t, i) {
            for (var u = 0, f = t.length; f > u; u++) r(n, t[u], i);
            return i
        }

        function pt(n, t, i, r, u) {
            for (var e, o = [], f = 0, s = n.length, h = null != t; s > f; f++) (e = n[f]) && (!i || i(e, r, u)) && (o.push(e), h && t.push(f));
            return o
        }

        function fi(n, t, i, r, u, e) {
            return r && !r[f] && (r = fi(r)), u && !u[f] && (u = fi(u, e)), h(function (f, e, o, s) {
                var l, c, a, p = [], y = [], w = e.length, k = f || ar(t || "*", o.nodeType ? [o] : o, []),
                    v = !n || !f && t ? k : pt(k, p, n, o, s), h = i ? u || (f ? n : w || r) ? [] : e : v;
                if (i && i(v, h, o, s), r) for (l = pt(h, y), r(l, [], o, s), c = l.length; c--;) (a = l[c]) && (h[y[c]] = !(v[y[c]] = a));
                if (f) {
                    if (u || n) {
                        if (u) {
                            for (l = [], c = h.length; c--;) (a = h[c]) && l.push(v[c] = a);
                            u(null, h = [], l, s)
                        }
                        for (c = h.length; c--;) (a = h[c]) && (l = u ? nt.call(f, a) : p[c]) > -1 && (f[l] = !(e[l] = a))
                    }
                } else h = pt(h === e ? h.splice(w, h.length) : h), u ? u(null, e, h, s) : b.apply(e, h)
            })
        }

        function ei(n) {
            for (var s, u, r, o = n.length, h = t.relative[n[0].type], c = h || t.relative[" "], i = h ? 1 : 0, l = ri(function (n) {
                return n === s
            }, c, !0), a = ri(function (n) {
                return nt.call(s, n) > -1
            }, c, !0), e = [function (n, t, i) {
                return !h && (i || t !== ct) || ((s = t).nodeType ? l(n, t, i) : a(n, t, i))
            }]; o > i; i++) if (u = t.relative[n[i].type]) e = [ri(ui(e), u)]; else {
                if (u = t.filter[n[i].type].apply(null, n[i].matches), u[f]) {
                    for (r = ++i; o > r; r++) if (t.relative[n[r].type]) break;
                    return fi(i > 1 && ui(e), i > 1 && yt(n.slice(0, i - 1).concat({ value: " " === n[i - 2].type ? "*" : "" })).replace(at, "$1"), u, r > i && ei(n.slice(i, r)), o > r && ei(n = n.slice(r)), o > r && yt(n))
                }
                e.push(u)
            }
            return ui(e)
        }

        function vr(n, i) {
            var u = i.length > 0, f = n.length > 0, o = function (o, s, h, c, l) {
                var y, d, w, k = 0, a = "0", g = o && [], p = [], nt = ct, tt = o || f && t.find.TAG("*", l),
                    it = v += null == nt ? 1 : Math.random() || .1, rt = tt.length;
                for (l && (ct = s !== e && s); a !== rt && null != (y = tt[a]); a++) {
                    if (f && y) {
                        for (d = 0; w = n[d++];) if (w(y, s, h)) {
                            c.push(y);
                            break
                        }
                        l && (v = it)
                    }
                    u && ((y = !w && y) && k-- , o && g.push(y))
                }
                if (k += a, u && a !== k) {
                    for (d = 0; w = i[d++];) w(g, p, s, h);
                    if (o) {
                        if (k > 0) while (a--) g[a] || p[a] || (p[a] = gi.call(c));
                        p = pt(p)
                    }
                    b.apply(c, p);
                    l && !o && p.length > 0 && k + i.length > 1 && r.uniqueSort(c)
                }
                return l && (v = it, ct = nt), g
            };
            return u ? h(o) : o
        }

        var it, u, t, ht, oi, et, wt, si, ct, y, rt, p, e, l, a, o, g, lt, ot, f = "sizzle" + -new Date, s = n.document,
            v = 0, ki = 0, hi = ni(), ci = ni(), li = ni(), bt = function (n, t) {
                return n === t && (rt = !0), 0
            }, ut = "undefined", ai = -2147483648, di = {}.hasOwnProperty, w = [], gi = w.pop, nr = w.push, b = w.push,
            vi = w.slice, nt = w.indexOf || function (n) {
                for (var t = 0, i = this.length; i > t; t++) if (this[t] === n) return t;
                return -1
            },
            kt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            i = "[\\x20\\t\\r\\n\\f]", ft = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", yi = ft.replace("w", "w#"),
            pi = "\\[" + i + "*(" + ft + ")(?:" + i + "*([*^$|!~]?=)" + i + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + yi + "))|)" + i + "*\\]",
            dt = ":(" + ft + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + pi + ")*)|.*)\\)|)",
            at = new RegExp("^" + i + "+|((?:^|[^\\\\])(?:\\\\.)*)" + i + "+$", "g"),
            tr = new RegExp("^" + i + "*," + i + "*"), ir = new RegExp("^" + i + "*([>+~]|" + i + ")" + i + "*"),
            rr = new RegExp("=" + i + "*([^\\]'\"]*?)" + i + "*\\]", "g"), ur = new RegExp(dt),
            fr = new RegExp("^" + yi + "$"), vt = {
                ID: new RegExp("^#(" + ft + ")"),
                CLASS: new RegExp("^\\.(" + ft + ")"),
                TAG: new RegExp("^(" + ft.replace("w", "w*") + ")"),
                ATTR: new RegExp("^" + pi),
                PSEUDO: new RegExp("^" + dt),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + i + "*(even|odd|(([+-]|)(\\d*)n|)" + i + "*(?:([+-]|)" + i + "*(\\d+)|))" + i + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + kt + ")$", "i"),
                needsContext: new RegExp("^" + i + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + i + "*((?:-\\d)?\\d*)" + i + "*\\)|)(?=[^-]|$)", "i")
            }, er = /^(?:input|select|textarea|button)$/i, or = /^h\d$/i, st = /^[^{]+\{\s*\[native \w/,
            sr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, gt = /[+~]/, hr = /'|\\/g,
            k = new RegExp("\\\\([\\da-f]{1,6}" + i + "?|(" + i + ")|.)", "ig"), d = function (n, t, i) {
                var r = "0x" + t - 65536;
                return r !== r || i ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
            };
        try {
            b.apply(w = vi.call(s.childNodes), s.childNodes);
            w[s.childNodes.length].nodeType
        } catch (yr) {
            b = {
                apply: w.length ? function (n, t) {
                    nr.apply(n, vi.call(t))
                } : function (n, t) {
                    for (var i = n.length, r = 0; n[i++] = t[r++];);
                    n.length = i - 1
                }
            }
        }
        u = r.support = {};
        oi = r.isXML = function (n) {
            var t = n && (n.ownerDocument || n).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        };
        p = r.setDocument = function (n) {
            var v, r = n ? n.ownerDocument || n : s, h = r.defaultView;
            return r !== e && 9 === r.nodeType && r.documentElement ? (e = r, l = r.documentElement, a = !oi(r), h && h !== h.top && (h.addEventListener ? h.addEventListener("unload", function () {
                p()
            }, !1) : h.attachEvent && h.attachEvent("onunload", function () {
                p()
            })), u.attributes = c(function (n) {
                return n.className = "i", !n.getAttribute("className")
            }), u.getElementsByTagName = c(function (n) {
                return n.appendChild(r.createComment("")), !n.getElementsByTagName("*").length
            }), u.getElementsByClassName = st.test(r.getElementsByClassName) && c(function (n) {
                return n.innerHTML = "<div class='a'><\/div><div class='a i'><\/div>", n.firstChild.className = "i", 2 === n.getElementsByClassName("i").length
            }), u.getById = c(function (n) {
                return l.appendChild(n).id = f, !r.getElementsByName || !r.getElementsByName(f).length
            }), u.getById ? (t.find.ID = function (n, t) {
                if (typeof t.getElementById !== ut && a) {
                    var i = t.getElementById(n);
                    return i && i.parentNode ? [i] : []
                }
            }, t.filter.ID = function (n) {
                var t = n.replace(k, d);
                return function (n) {
                    return n.getAttribute("id") === t
                }
            }) : (delete t.find.ID, t.filter.ID = function (n) {
                var t = n.replace(k, d);
                return function (n) {
                    var i = typeof n.getAttributeNode !== ut && n.getAttributeNode("id");
                    return i && i.value === t
                }
            }), t.find.TAG = u.getElementsByTagName ? function (n, t) {
                if (typeof t.getElementsByTagName !== ut) return t.getElementsByTagName(n)
            } : function (n, t) {
                var i, r = [], f = 0, u = t.getElementsByTagName(n);
                if ("*" === n) {
                    while (i = u[f++]) 1 === i.nodeType && r.push(i);
                    return r
                }
                return u
            }, t.find.CLASS = u.getElementsByClassName && function (n, t) {
                if (typeof t.getElementsByClassName !== ut && a) return t.getElementsByClassName(n)
            }, g = [], o = [], (u.qsa = st.test(r.querySelectorAll)) && (c(function (n) {
                n.innerHTML = "<select msallowclip=''><option selected=''><\/option><\/select>";
                n.querySelectorAll("[msallowclip^='']").length && o.push("[*^$]=" + i + "*(?:''|\"\")");
                n.querySelectorAll("[selected]").length || o.push("\\[" + i + "*(?:value|" + kt + ")");
                n.querySelectorAll(":checked").length || o.push(":checked")
            }), c(function (n) {
                var t = r.createElement("input");
                t.setAttribute("type", "hidden");
                n.appendChild(t).setAttribute("name", "D");
                n.querySelectorAll("[name=d]").length && o.push("name" + i + "*[*^$|!~]?=");
                n.querySelectorAll(":enabled").length || o.push(":enabled", ":disabled");
                n.querySelectorAll("*,:x");
                o.push(",.*:")
            })), (u.matchesSelector = st.test(lt = l.matches || l.webkitMatchesSelector || l.mozMatchesSelector || l.oMatchesSelector || l.msMatchesSelector)) && c(function (n) {
                u.disconnectedMatch = lt.call(n, "div");
                lt.call(n, "[s!='']:x");
                g.push("!=", dt)
            }), o = o.length && new RegExp(o.join("|")), g = g.length && new RegExp(g.join("|")), v = st.test(l.compareDocumentPosition), ot = v || st.test(l.contains) ? function (n, t) {
                var r = 9 === n.nodeType ? n.documentElement : n, i = t && t.parentNode;
                return n === i || !(!i || 1 !== i.nodeType || !(r.contains ? r.contains(i) : n.compareDocumentPosition && 16 & n.compareDocumentPosition(i)))
            } : function (n, t) {
                if (t) while (t = t.parentNode) if (t === n) return !0;
                return !1
            }, bt = v ? function (n, t) {
                if (n === t) return rt = !0, 0;
                var i = !n.compareDocumentPosition - !t.compareDocumentPosition;
                return i ? i : (i = (n.ownerDocument || n) === (t.ownerDocument || t) ? n.compareDocumentPosition(t) : 1, 1 & i || !u.sortDetached && t.compareDocumentPosition(n) === i ? n === r || n.ownerDocument === s && ot(s, n) ? -1 : t === r || t.ownerDocument === s && ot(s, t) ? 1 : y ? nt.call(y, n) - nt.call(y, t) : 0 : 4 & i ? -1 : 1)
            } : function (n, t) {
                if (n === t) return rt = !0, 0;
                var i, u = 0, o = n.parentNode, h = t.parentNode, f = [n], e = [t];
                if (!o || !h) return n === r ? -1 : t === r ? 1 : o ? -1 : h ? 1 : y ? nt.call(y, n) - nt.call(y, t) : 0;
                if (o === h) return wi(n, t);
                for (i = n; i = i.parentNode;) f.unshift(i);
                for (i = t; i = i.parentNode;) e.unshift(i);
                while (f[u] === e[u]) u++;
                return u ? wi(f[u], e[u]) : f[u] === s ? -1 : e[u] === s ? 1 : 0
            }, r) : e
        };
        r.matches = function (n, t) {
            return r(n, null, null, t)
        };
        r.matchesSelector = function (n, t) {
            if ((n.ownerDocument || n) !== e && p(n), t = t.replace(rr, "='$1']"), !(!u.matchesSelector || !a || g && g.test(t) || o && o.test(t))) try {
                var i = lt.call(n, t);
                if (i || u.disconnectedMatch || n.document && 11 !== n.document.nodeType) return i
            } catch (f) {
            }
            return r(t, e, null, [n]).length > 0
        };
        r.contains = function (n, t) {
            return (n.ownerDocument || n) !== e && p(n), ot(n, t)
        };
        r.attr = function (n, i) {
            (n.ownerDocument || n) !== e && p(n);
            var f = t.attrHandle[i.toLowerCase()],
                r = f && di.call(t.attrHandle, i.toLowerCase()) ? f(n, i, !a) : void 0;
            return void 0 !== r ? r : u.attributes || !a ? n.getAttribute(i) : (r = n.getAttributeNode(i)) && r.specified ? r.value : null
        };
        r.error = function (n) {
            throw new Error("Syntax error, unrecognized expression: " + n);
        };
        r.uniqueSort = function (n) {
            var r, f = [], t = 0, i = 0;
            if (rt = !u.detectDuplicates, y = !u.sortStable && n.slice(0), n.sort(bt), rt) {
                while (r = n[i++]) r === n[i] && (t = f.push(i));
                while (t--) n.splice(f[t], 1)
            }
            return y = null, n
        };
        ht = r.getText = function (n) {
            var r, i = "", u = 0, t = n.nodeType;
            if (t) {
                if (1 === t || 9 === t || 11 === t) {
                    if ("string" == typeof n.textContent) return n.textContent;
                    for (n = n.firstChild; n; n = n.nextSibling) i += ht(n)
                } else if (3 === t || 4 === t) return n.nodeValue
            } else while (r = n[u++]) i += ht(r);
            return i
        };
        t = r.selectors = {
            cacheLength: 50,
            createPseudo: h,
            match: vt,
            attrHandle: {},
            find: {},
            relative: {
                ">": { dir: "parentNode", first: !0 },
                " ": { dir: "parentNode" },
                "+": { dir: "previousSibling", first: !0 },
                "~": { dir: "previousSibling" }
            },
            preFilter: {
                ATTR: function (n) {
                    return n[1] = n[1].replace(k, d), n[3] = (n[3] || n[4] || n[5] || "").replace(k, d), "~=" === n[2] && (n[3] = " " + n[3] + " "), n.slice(0, 4)
                }, CHILD: function (n) {
                    return n[1] = n[1].toLowerCase(), "nth" === n[1].slice(0, 3) ? (n[3] || r.error(n[0]), n[4] = +(n[4] ? n[5] + (n[6] || 1) : 2 * ("even" === n[3] || "odd" === n[3])), n[5] = +(n[7] + n[8] || "odd" === n[3])) : n[3] && r.error(n[0]), n
                }, PSEUDO: function (n) {
                    var i, t = !n[6] && n[2];
                    return vt.CHILD.test(n[0]) ? null : (n[3] ? n[2] = n[4] || n[5] || "" : t && ur.test(t) && (i = et(t, !0)) && (i = t.indexOf(")", t.length - i) - t.length) && (n[0] = n[0].slice(0, i), n[2] = t.slice(0, i)), n.slice(0, 3))
                }
            },
            filter: {
                TAG: function (n) {
                    var t = n.replace(k, d).toLowerCase();
                    return "*" === n ? function () {
                        return !0
                    } : function (n) {
                        return n.nodeName && n.nodeName.toLowerCase() === t
                    }
                }, CLASS: function (n) {
                    var t = hi[n + " "];
                    return t || (t = new RegExp("(^|" + i + ")" + n + "(" + i + "|$)")) && hi(n, function (n) {
                        return t.test("string" == typeof n.className && n.className || typeof n.getAttribute !== ut && n.getAttribute("class") || "")
                    })
                }, ATTR: function (n, t, i) {
                    return function (u) {
                        var f = r.attr(u, n);
                        return null == f ? "!=" === t : t ? (f += "", "=" === t ? f === i : "!=" === t ? f !== i : "^=" === t ? i && 0 === f.indexOf(i) : "*=" === t ? i && f.indexOf(i) > -1 : "$=" === t ? i && f.slice(-i.length) === i : "~=" === t ? (" " + f + " ").indexOf(i) > -1 : "|=" === t ? f === i || f.slice(0, i.length + 1) === i + "-" : !1) : !0
                    }
                }, CHILD: function (n, t, i, r, u) {
                    var s = "nth" !== n.slice(0, 3), o = "last" !== n.slice(-4), e = "of-type" === t;
                    return 1 === r && 0 === u ? function (n) {
                        return !!n.parentNode
                    } : function (t, i, h) {
                        var a, k, c, l, y, w, b = s !== o ? "nextSibling" : "previousSibling", p = t.parentNode,
                            g = e && t.nodeName.toLowerCase(), d = !h && !e;
                        if (p) {
                            if (s) {
                                while (b) {
                                    for (c = t; c = c[b];) if (e ? c.nodeName.toLowerCase() === g : 1 === c.nodeType) return !1;
                                    w = b = "only" === n && !w && "nextSibling"
                                }
                                return !0
                            }
                            if (w = [o ? p.firstChild : p.lastChild], o && d) {
                                for (k = p[f] || (p[f] = {}), a = k[n] || [], y = a[0] === v && a[1], l = a[0] === v && a[2], c = y && p.childNodes[y]; c = ++y && c && c[b] || (l = y = 0) || w.pop();) if (1 === c.nodeType && ++l && c === t) {
                                    k[n] = [v, y, l];
                                    break
                                }
                            } else if (d && (a = (t[f] || (t[f] = {}))[n]) && a[0] === v) l = a[1]; else while (c = ++y && c && c[b] || (l = y = 0) || w.pop()) if ((e ? c.nodeName.toLowerCase() === g : 1 === c.nodeType) && ++l && (d && ((c[f] || (c[f] = {}))[n] = [v, l]), c === t)) break;
                            return l -= u, l === r || l % r == 0 && l / r >= 0
                        }
                    }
                }, PSEUDO: function (n, i) {
                    var e, u = t.pseudos[n] || t.setFilters[n.toLowerCase()] || r.error("unsupported pseudo: " + n);
                    return u[f] ? u(i) : u.length > 1 ? (e = [n, n, "", i], t.setFilters.hasOwnProperty(n.toLowerCase()) ? h(function (n, t) {
                        for (var r, f = u(n, i), e = f.length; e--;) r = nt.call(n, f[e]), n[r] = !(t[r] = f[e])
                    }) : function (n) {
                        return u(n, 0, e)
                    }) : u
                }
            },
            pseudos: {
                not: h(function (n) {
                    var i = [], r = [], t = wt(n.replace(at, "$1"));
                    return t[f] ? h(function (n, i, r, u) {
                        for (var e, o = t(n, null, u, []), f = n.length; f--;) (e = o[f]) && (n[f] = !(i[f] = e))
                    }) : function (n, u, f) {
                        return i[0] = n, t(i, null, f, r), !r.pop()
                    }
                }), has: h(function (n) {
                    return function (t) {
                        return r(n, t).length > 0
                    }
                }), contains: h(function (n) {
                    return function (t) {
                        return (t.textContent || t.innerText || ht(t)).indexOf(n) > -1
                    }
                }), lang: h(function (n) {
                    return fr.test(n || "") || r.error("unsupported lang: " + n), n = n.replace(k, d).toLowerCase(), function (t) {
                        var i;
                        do if (i = a ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return i = i.toLowerCase(), i === n || 0 === i.indexOf(n + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                        return !1
                    }
                }), target: function (t) {
                    var i = n.location && n.location.hash;
                    return i && i.slice(1) === t.id
                }, root: function (n) {
                    return n === l
                }, focus: function (n) {
                    return n === e.activeElement && (!e.hasFocus || e.hasFocus()) && !!(n.type || n.href || ~n.tabIndex)
                }, enabled: function (n) {
                    return n.disabled === !1
                }, disabled: function (n) {
                    return n.disabled === !0
                }, checked: function (n) {
                    var t = n.nodeName.toLowerCase();
                    return "input" === t && !!n.checked || "option" === t && !!n.selected
                }, selected: function (n) {
                    return n.parentNode && n.parentNode.selectedIndex, n.selected === !0
                }, empty: function (n) {
                    for (n = n.firstChild; n; n = n.nextSibling) if (n.nodeType < 6) return !1;
                    return !0
                }, parent: function (n) {
                    return !t.pseudos.empty(n)
                }, header: function (n) {
                    return or.test(n.nodeName)
                }, input: function (n) {
                    return er.test(n.nodeName)
                }, button: function (n) {
                    var t = n.nodeName.toLowerCase();
                    return "input" === t && "button" === n.type || "button" === t
                }, text: function (n) {
                    var t;
                    return "input" === n.nodeName.toLowerCase() && "text" === n.type && (null == (t = n.getAttribute("type")) || "text" === t.toLowerCase())
                }, first: tt(function () {
                    return [0]
                }), last: tt(function (n, t) {
                    return [t - 1]
                }), eq: tt(function (n, t, i) {
                    return [0 > i ? i + t : i]
                }), even: tt(function (n, t) {
                    for (var i = 0; t > i; i += 2) n.push(i);
                    return n
                }), odd: tt(function (n, t) {
                    for (var i = 1; t > i; i += 2) n.push(i);
                    return n
                }), lt: tt(function (n, t, i) {
                    for (var r = 0 > i ? i + t : i; --r >= 0;) n.push(r);
                    return n
                }), gt: tt(function (n, t, i) {
                    for (var r = 0 > i ? i + t : i; ++r < t;) n.push(r);
                    return n
                })
            }
        };
        t.pseudos.nth = t.pseudos.eq;
        for (it in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) t.pseudos[it] = cr(it);
        for (it in { submit: !0, reset: !0 }) t.pseudos[it] = lr(it);
        return bi.prototype = t.filters = t.pseudos, t.setFilters = new bi, et = r.tokenize = function (n, i) {
            var e, f, s, o, u, h, c, l = ci[n + " "];
            if (l) return i ? 0 : l.slice(0);
            for (u = n, h = [], c = t.preFilter; u;) {
                (!e || (f = tr.exec(u))) && (f && (u = u.slice(f[0].length) || u), h.push(s = []));
                e = !1;
                (f = ir.exec(u)) && (e = f.shift(), s.push({
                    value: e,
                    type: f[0].replace(at, " ")
                }), u = u.slice(e.length));
                for (o in t.filter) (f = vt[o].exec(u)) && (!c[o] || (f = c[o](f))) && (e = f.shift(), s.push({
                    value: e,
                    type: o,
                    matches: f
                }), u = u.slice(e.length));
                if (!e) break
            }
            return i ? u.length : u ? r.error(n) : ci(n, h).slice(0)
        }, wt = r.compile = function (n, t) {
            var r, u = [], e = [], i = li[n + " "];
            if (!i) {
                for (t || (t = et(n)), r = t.length; r--;) i = ei(t[r]), i[f] ? u.push(i) : e.push(i);
                i = li(n, vr(e, u));
                i.selector = n
            }
            return i
        }, si = r.select = function (n, i, r, f) {
            var s, e, o, l, v, c = "function" == typeof n && n, h = !f && et(n = c.selector || n);
            if (r = r || [], 1 === h.length) {
                if (e = h[0] = h[0].slice(0), e.length > 2 && "ID" === (o = e[0]).type && u.getById && 9 === i.nodeType && a && t.relative[e[1].type]) {
                    if (i = (t.find.ID(o.matches[0].replace(k, d), i) || [])[0], !i) return r;
                    c && (i = i.parentNode);
                    n = n.slice(e.shift().value.length)
                }
                for (s = vt.needsContext.test(n) ? 0 : e.length; s--;) {
                    if (o = e[s], t.relative[l = o.type]) break;
                    if ((v = t.find[l]) && (f = v(o.matches[0].replace(k, d), gt.test(e[0].type) && ii(i.parentNode) || i))) {
                        if (e.splice(s, 1), n = f.length && yt(e), !n) return b.apply(r, f), r;
                        break
                    }
                }
            }
            return (c || wt(n, h))(f, i, !a, r, gt.test(n) && ii(i.parentNode) || i), r
        }, u.sortStable = f.split("").sort(bt).join("") === f, u.detectDuplicates = !!rt, p(), u.sortDetached = c(function (n) {
            return 1 & n.compareDocumentPosition(e.createElement("div"))
        }), c(function (n) {
            return n.innerHTML = "<a href='#'><\/a>", "#" === n.firstChild.getAttribute("href")
        }) || ti("type|href|height|width", function (n, t, i) {
            if (!i) return n.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), u.attributes && c(function (n) {
            return n.innerHTML = "<input/>", n.firstChild.setAttribute("value", ""), "" === n.firstChild.getAttribute("value")
        }) || ti("value", function (n, t, i) {
            if (!i && "input" === n.nodeName.toLowerCase()) return n.defaultValue
        }), c(function (n) {
            return null == n.getAttribute("disabled")
        }) || ti(kt, function (n, t, i) {
            var r;
            if (!i) return n[t] === !0 ? t.toLowerCase() : (r = n.getAttributeNode(t)) && r.specified ? r.value : null
        }), r
    }(n);
    i.find = p;
    i.expr = p.selectors;
    i.expr[":"] = i.expr.pseudos;
    i.unique = p.uniqueSort;
    i.text = p.getText;
    i.isXMLDoc = p.isXML;
    i.contains = p.contains;
    var fr = i.expr.match.needsContext, er = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, re = /^.[^:#\[\.,]*$/;
    i.filter = function (n, t, r) {
        var u = t[0];
        return r && (n = ":not(" + n + ")"), 1 === t.length && 1 === u.nodeType ? i.find.matchesSelector(u, n) ? [u] : [] : i.find.matches(n, i.grep(t, function (n) {
            return 1 === n.nodeType
        }))
    };
    i.fn.extend({
        find: function (n) {
            var t, r = [], u = this, f = u.length;
            if ("string" != typeof n) return this.pushStack(i(n).filter(function () {
                for (t = 0; f > t; t++) if (i.contains(u[t], this)) return !0
            }));
            for (t = 0; f > t; t++) i.find(n, u[t], r);
            return r = this.pushStack(f > 1 ? i.unique(r) : r), r.selector = this.selector ? this.selector + " " + n : n, r
        }, filter: function (n) {
            return this.pushStack(ui(this, n || [], !1))
        }, not: function (n) {
            return this.pushStack(ui(this, n || [], !0))
        }, is: function (n) {
            return !!ui(this, "string" == typeof n && fr.test(n) ? i(n) : n || [], !1).length
        }
    });
    var ft, u = n.document, ue = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, fe = i.fn.init = function (n, t) {
        var r, f;
        if (!n) return this;
        if ("string" == typeof n) {
            if (r = "<" === n.charAt(0) && ">" === n.charAt(n.length - 1) && n.length >= 3 ? [null, n, null] : ue.exec(n), !r || !r[1] && t) return !t || t.jquery ? (t || ft).find(n) : this.constructor(t).find(n);
            if (r[1]) {
                if (t = t instanceof i ? t[0] : t, i.merge(this, i.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : u, !0)), er.test(r[1]) && i.isPlainObject(t)) for (r in t) i.isFunction(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            if (f = u.getElementById(r[2]), f && f.parentNode) {
                if (f.id !== r[2]) return ft.find(n);
                this.length = 1;
                this[0] = f
            }
            return this.context = u, this.selector = n, this
        }
        return n.nodeType ? (this.context = this[0] = n, this.length = 1, this) : i.isFunction(n) ? "undefined" != typeof ft.ready ? ft.ready(n) : n(i) : (void 0 !== n.selector && (this.selector = n.selector, this.context = n.context), i.makeArray(n, this))
    };
    fe.prototype = i.fn;
    ft = i(u);
    or = /^(?:parents|prev(?:Until|All))/;
    sr = { children: !0, contents: !0, next: !0, prev: !0 };
    i.extend({
        dir: function (n, t, r) {
            for (var f = [], u = n[t]; u && 9 !== u.nodeType && (void 0 === r || 1 !== u.nodeType || !i(u).is(r));) 1 === u.nodeType && f.push(u), u = u[t];
            return f
        }, sibling: function (n, t) {
            for (var i = []; n; n = n.nextSibling) 1 === n.nodeType && n !== t && i.push(n);
            return i
        }
    });
    i.fn.extend({
        has: function (n) {
            var t, r = i(n, this), u = r.length;
            return this.filter(function () {
                for (t = 0; u > t; t++) if (i.contains(this, r[t])) return !0
            })
        }, closest: function (n, t) {
            for (var r, f = 0, o = this.length, u = [], e = fr.test(n) || "string" != typeof n ? i(n, t || this.context) : 0; o > f; f++) for (r = this[f]; r && r !== t; r = r.parentNode) if (r.nodeType < 11 && (e ? e.index(r) > -1 : 1 === r.nodeType && i.find.matchesSelector(r, n))) {
                u.push(r);
                break
            }
            return this.pushStack(u.length > 1 ? i.unique(u) : u)
        }, index: function (n) {
            return n ? "string" == typeof n ? i.inArray(this[0], i(n)) : i.inArray(n.jquery ? n[0] : n, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        }, add: function (n, t) {
            return this.pushStack(i.unique(i.merge(this.get(), i(n, t))))
        }, addBack: function (n) {
            return this.add(null == n ? this.prevObject : this.prevObject.filter(n))
        }
    });
    i.each({
        parent: function (n) {
            var t = n.parentNode;
            return t && 11 !== t.nodeType ? t : null
        }, parents: function (n) {
            return i.dir(n, "parentNode")
        }, parentsUntil: function (n, t, r) {
            return i.dir(n, "parentNode", r)
        }, next: function (n) {
            return hr(n, "nextSibling")
        }, prev: function (n) {
            return hr(n, "previousSibling")
        }, nextAll: function (n) {
            return i.dir(n, "nextSibling")
        }, prevAll: function (n) {
            return i.dir(n, "previousSibling")
        }, nextUntil: function (n, t, r) {
            return i.dir(n, "nextSibling", r)
        }, prevUntil: function (n, t, r) {
            return i.dir(n, "previousSibling", r)
        }, siblings: function (n) {
            return i.sibling((n.parentNode || {}).firstChild, n)
        }, children: function (n) {
            return i.sibling(n.firstChild)
        }, contents: function (n) {
            return i.nodeName(n, "iframe") ? n.contentDocument || n.contentWindow.document : i.merge([], n.childNodes)
        }
    }, function (n, t) {
        i.fn[n] = function (r, u) {
            var f = i.map(this, t, r);
            return "Until" !== n.slice(-5) && (u = r), u && "string" == typeof u && (f = i.filter(u, f)), this.length > 1 && (sr[n] || (f = i.unique(f)), or.test(n) && (f = f.reverse())), this.pushStack(f)
        }
    });
    h = /\S+/g;
    fi = {};
    i.Callbacks = function (n) {
        n = "string" == typeof n ? fi[n] || ee(n) : i.extend({}, n);
        var o, u, h, f, e, c, t = [], r = !n.once && [], l = function (i) {
            for (u = n.memory && i, h = !0, e = c || 0, c = 0, f = t.length, o = !0; t && f > e; e++) if (t[e].apply(i[0], i[1]) === !1 && n.stopOnFalse) {
                u = !1;
                break
            }
            o = !1;
            t && (r ? r.length && l(r.shift()) : u ? t = [] : s.disable())
        }, s = {
            add: function () {
                if (t) {
                    var r = t.length;
                    !function e(r) {
                        i.each(r, function (r, u) {
                            var f = i.type(u);
                            "function" === f ? n.unique && s.has(u) || t.push(u) : u && u.length && "string" !== f && e(u)
                        })
                    }(arguments);
                    o ? f = t.length : u && (c = r, l(u))
                }
                return this
            }, remove: function () {
                return t && i.each(arguments, function (n, r) {
                    for (var u; (u = i.inArray(r, t, u)) > -1;) t.splice(u, 1), o && (f >= u && f-- , e >= u && e--)
                }), this
            }, has: function (n) {
                return n ? i.inArray(n, t) > -1 : !(!t || !t.length)
            }, empty: function () {
                return t = [], f = 0, this
            }, disable: function () {
                return t = r = u = void 0, this
            }, disabled: function () {
                return !t
            }, lock: function () {
                return r = void 0, u || s.disable(), this
            }, locked: function () {
                return !r
            }, fireWith: function (n, i) {
                return !t || h && !r || (i = i || [], i = [n, i.slice ? i.slice() : i], o ? r.push(i) : l(i)), this
            }, fire: function () {
                return s.fireWith(this, arguments), this
            }, fired: function () {
                return !!h
            }
        };
        return s
    };
    i.extend({
        Deferred: function (n) {
            var u = [["resolve", "done", i.Callbacks("once memory"), "resolved"], ["reject", "fail", i.Callbacks("once memory"), "rejected"], ["notify", "progress", i.Callbacks("memory")]],
                f = "pending", r = {
                    state: function () {
                        return f
                    }, always: function () {
                        return t.done(arguments).fail(arguments), this
                    }, then: function () {
                        var n = arguments;
                        return i.Deferred(function (f) {
                            i.each(u, function (u, e) {
                                var o = i.isFunction(n[u]) && n[u];
                                t[e[1]](function () {
                                    var n = o && o.apply(this, arguments);
                                    n && i.isFunction(n.promise) ? n.promise().done(f.resolve).fail(f.reject).progress(f.notify) : f[e[0] + "With"](this === r ? f.promise() : this, o ? [n] : arguments)
                                })
                            });
                            n = null
                        }).promise()
                    }, promise: function (n) {
                        return null != n ? i.extend(n, r) : r
                    }
                }, t = {};
            return r.pipe = r.then, i.each(u, function (n, i) {
                var e = i[2], o = i[3];
                r[i[1]] = e.add;
                o && e.add(function () {
                    f = o
                }, u[1 ^ n][2].disable, u[2][2].lock);
                t[i[0]] = function () {
                    return t[i[0] + "With"](this === t ? r : this, arguments), this
                };
                t[i[0] + "With"] = e.fireWith
            }), r.promise(t), n && n.call(t, t), t
        }, when: function (n) {
            var t = 0, u = l.call(arguments), r = u.length, e = 1 !== r || n && i.isFunction(n.promise) ? r : 0,
                f = 1 === e ? n : i.Deferred(), h = function (n, t, i) {
                    return function (r) {
                        t[n] = this;
                        i[n] = arguments.length > 1 ? l.call(arguments) : r;
                        i === o ? f.notifyWith(t, i) : --e || f.resolveWith(t, i)
                    }
                }, o, c, s;
            if (r > 1) for (o = new Array(r), c = new Array(r), s = new Array(r); r > t; t++) u[t] && i.isFunction(u[t].promise) ? u[t].promise().done(h(t, s, u)).fail(f.reject).progress(h(t, c, o)) : --e;
            return e || f.resolveWith(s, u), f.promise()
        }
    });
    i.fn.ready = function (n) {
        return i.ready.promise().done(n), this
    };
    i.extend({
        isReady: !1, readyWait: 1, holdReady: function (n) {
            n ? i.readyWait++ : i.ready(!0)
        }, ready: function (n) {
            if (n === !0 ? !--i.readyWait : !i.isReady) {
                if (!u.body) return setTimeout(i.ready);
                i.isReady = !0;
                n !== !0 && --i.readyWait > 0 || (lt.resolveWith(u, [i]), i.fn.triggerHandler && (i(u).triggerHandler("ready"), i(u).off("ready")))
            }
        }
    });
    i.ready.promise = function (t) {
        if (!lt) if (lt = i.Deferred(), "complete" === u.readyState) setTimeout(i.ready); else if (u.addEventListener) u.addEventListener("DOMContentLoaded", a, !1), n.addEventListener("load", a, !1); else {
            u.attachEvent("onreadystatechange", a);
            n.attachEvent("onload", a);
            var r = !1;
            try {
                r = null == n.frameElement && u.documentElement
            } catch (e) {
            }
            r && r.doScroll && !function f() {
                if (!i.isReady) {
                    try {
                        r.doScroll("left")
                    } catch (n) {
                        return setTimeout(f, 50)
                    }
                    cr();
                    i.ready()
                }
            }()
        }
        return lt.promise(t)
    };
    o = "undefined";
    for (lr in i(r)) break;
    r.ownLast = "0" !== lr;
    r.inlineBlockNeedsLayout = !1;
    i(function () {
        var f, t, n, i;
        n = u.getElementsByTagName("body")[0];
        n && n.style && (t = u.createElement("div"), i = u.createElement("div"), i.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", n.appendChild(i).appendChild(t), typeof t.style.zoom !== o && (t.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", r.inlineBlockNeedsLayout = f = 3 === t.offsetWidth, f && (n.style.zoom = 1)), n.removeChild(i))
    }), function () {
        var n = u.createElement("div");
        if (null == r.deleteExpando) {
            r.deleteExpando = !0;
            try {
                delete n.test
            } catch (t) {
                r.deleteExpando = !1
            }
        }
        n = null
    }();
    i.acceptData = function (n) {
        var t = i.noData[(n.nodeName + " ").toLowerCase()], r = +n.nodeType || 1;
        return 1 !== r && 9 !== r ? !1 : !t || t !== !0 && n.getAttribute("classid") === t
    };
    ar = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/;
    vr = /([A-Z])/g;
    i.extend({
        cache: {},
        noData: { "applet ": !0, "embed ": !0, "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" },
        hasData: function (n) {
            return n = n.nodeType ? i.cache[n[i.expando]] : n[i.expando], !!n && !ei(n)
        },
        data: function (n, t, i) {
            return pr(n, t, i)
        },
        removeData: function (n, t) {
            return wr(n, t)
        },
        _data: function (n, t, i) {
            return pr(n, t, i, !0)
        },
        _removeData: function (n, t) {
            return wr(n, t, !0)
        }
    });
    i.fn.extend({
        data: function (n, t) {
            var f, u, e, r = this[0], o = r && r.attributes;
            if (void 0 === n) {
                if (this.length && (e = i.data(r), 1 === r.nodeType && !i._data(r, "parsedAttrs"))) {
                    for (f = o.length; f--;) o[f] && (u = o[f].name, 0 === u.indexOf("data-") && (u = i.camelCase(u.slice(5)), yr(r, u, e[u])));
                    i._data(r, "parsedAttrs", !0)
                }
                return e
            }
            return "object" == typeof n ? this.each(function () {
                i.data(this, n)
            }) : arguments.length > 1 ? this.each(function () {
                i.data(this, n, t)
            }) : r ? yr(r, n, i.data(r, n)) : void 0
        }, removeData: function (n) {
            return this.each(function () {
                i.removeData(this, n)
            })
        }
    });
    i.extend({
        queue: function (n, t, r) {
            var u;
            if (n) return (t = (t || "fx") + "queue", u = i._data(n, t), r && (!u || i.isArray(r) ? u = i._data(n, t, i.makeArray(r)) : u.push(r)), u || [])
        }, dequeue: function (n, t) {
            t = t || "fx";
            var r = i.queue(n, t), e = r.length, u = r.shift(), f = i._queueHooks(n, t), o = function () {
                i.dequeue(n, t)
            };
            "inprogress" === u && (u = r.shift(), e--);
            u && ("fx" === t && r.unshift("inprogress"), delete f.stop, u.call(n, o, f));
            !e && f && f.empty.fire()
        }, _queueHooks: function (n, t) {
            var r = t + "queueHooks";
            return i._data(n, r) || i._data(n, r, {
                empty: i.Callbacks("once memory").add(function () {
                    i._removeData(n, t + "queue");
                    i._removeData(n, r)
                })
            })
        }
    });
    i.fn.extend({
        queue: function (n, t) {
            var r = 2;
            return "string" != typeof n && (t = n, n = "fx", r--), arguments.length < r ? i.queue(this[0], n) : void 0 === t ? this : this.each(function () {
                var r = i.queue(this, n, t);
                i._queueHooks(this, n);
                "fx" === n && "inprogress" !== r[0] && i.dequeue(this, n)
            })
        }, dequeue: function (n) {
            return this.each(function () {
                i.dequeue(this, n)
            })
        }, clearQueue: function (n) {
            return this.queue(n || "fx", [])
        }, promise: function (n, t) {
            var r, f = 1, e = i.Deferred(), u = this, o = this.length, s = function () {
                --f || e.resolveWith(u, [u])
            };
            for ("string" != typeof n && (t = n, n = void 0), n = n || "fx"; o--;) r = i._data(u[o], n + "queueHooks"), r && r.empty && (f++ , r.empty.add(s));
            return s(), e.promise(t)
        }
    });
    var at = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, w = ["Top", "Right", "Bottom", "Left"],
        et = function (n, t) {
            return n = t || n, "none" === i.css(n, "display") || !i.contains(n.ownerDocument, n)
        }, b = i.access = function (n, t, r, u, f, e, o) {
            var s = 0, c = n.length, h = null == r;
            if ("object" === i.type(r)) {
                f = !0;
                for (s in r) i.access(n, t, s, r[s], !0, e, o)
            } else if (void 0 !== u && (f = !0, i.isFunction(u) || (o = !0), h && (o ? (t.call(n, u), t = null) : (h = t, t = function (n, t, r) {
                return h.call(i(n), r)
            })), t)) for (; c > s; s++) t(n[s], r, o ? u : u.call(n[s], s, t(n[s], r)));
            return f ? n : h ? t.call(n) : c ? t(n[0], r) : e
        }, oi = /^(?:checkbox|radio)$/i;
    !function () {
        var t = u.createElement("input"), n = u.createElement("div"), i = u.createDocumentFragment();
        if (n.innerHTML = "  <link/><table><\/table><a href='/a'>a<\/a><input type='checkbox'/>", r.leadingWhitespace = 3 === n.firstChild.nodeType, r.tbody = !n.getElementsByTagName("tbody").length, r.htmlSerialize = !!n.getElementsByTagName("link").length, r.html5Clone = "<:nav><\/:nav>" !== u.createElement("nav").cloneNode(!0).outerHTML, t.type = "checkbox", t.checked = !0, i.appendChild(t), r.appendChecked = t.checked, n.innerHTML = "<textarea>x<\/textarea>", r.noCloneChecked = !!n.cloneNode(!0).lastChild.defaultValue, i.appendChild(n), n.innerHTML = "<input type='radio' checked='checked' name='t'/>", r.checkClone = n.cloneNode(!0).cloneNode(!0).lastChild.checked, r.noCloneEvent = !0, n.attachEvent && (n.attachEvent("onclick", function () {
            r.noCloneEvent = !1
        }), n.cloneNode(!0).click()), null == r.deleteExpando) {
            r.deleteExpando = !0;
            try {
                delete n.test
            } catch (f) {
                r.deleteExpando = !1
            }
        }
    }(), function () {
        var t, i, f = u.createElement("div");
        for (t in {
            submit: !0,
            change: !0,
            focusin: !0
        }) i = "on" + t, (r[t + "Bubbles"] = i in n) || (f.setAttribute(i, "t"), r[t + "Bubbles"] = f.attributes[i].expando === !1);
        f = null
    }();
    var si = /^(?:input|select|textarea)$/i, oe = /^key/, se = /^(?:mouse|pointer|contextmenu)|click/,
        br = /^(?:focusinfocus|focusoutblur)$/, kr = /^([^.]*)(?:\.(.+)|)$/;
    i.event = {
        global: {},
        add: function (n, t, r, u, f) {
            var w, y, b, p, s, c, l, a, e, k, d, v = i._data(n);
            if (v) {
                for (r.handler && (p = r, r = p.handler, f = p.selector), r.guid || (r.guid = i.guid++), (y = v.events) || (y = v.events = {}), (c = v.handle) || (c = v.handle = function (n) {
                    if (typeof i !== o && (!n || i.event.triggered !== n.type)) return i.event.dispatch.apply(c.elem, arguments)
                }, c.elem = n), t = (t || "").match(h) || [""], b = t.length; b--;) w = kr.exec(t[b]) || [], e = d = w[1], k = (w[2] || "").split(".").sort(), e && (s = i.event.special[e] || {}, e = (f ? s.delegateType : s.bindType) || e, s = i.event.special[e] || {}, l = i.extend({
                    type: e,
                    origType: d,
                    data: u,
                    handler: r,
                    guid: r.guid,
                    selector: f,
                    needsContext: f && i.expr.match.needsContext.test(f),
                    namespace: k.join(".")
                }, p), (a = y[e]) || (a = y[e] = [], a.delegateCount = 0, s.setup && s.setup.call(n, u, k, c) !== !1 || (n.addEventListener ? n.addEventListener(e, c, !1) : n.attachEvent && n.attachEvent("on" + e, c))), s.add && (s.add.call(n, l), l.handler.guid || (l.handler.guid = r.guid)), f ? a.splice(a.delegateCount++, 0, l) : a.push(l), i.event.global[e] = !0);
                n = null
            }
        },
        remove: function (n, t, r, u, f) {
            var y, o, s, b, p, a, c, l, e, w, k, v = i.hasData(n) && i._data(n);
            if (v && (a = v.events)) {
                for (t = (t || "").match(h) || [""], p = t.length; p--;) if (s = kr.exec(t[p]) || [], e = k = s[1], w = (s[2] || "").split(".").sort(), e) {
                    for (c = i.event.special[e] || {}, e = (u ? c.delegateType : c.bindType) || e, l = a[e] || [], s = s[2] && new RegExp("(^|\\.)" + w.join("\\.(?:.*\\.|)") + "(\\.|$)"), b = y = l.length; y--;) o = l[y], !f && k !== o.origType || r && r.guid !== o.guid || s && !s.test(o.namespace) || u && u !== o.selector && ("**" !== u || !o.selector) || (l.splice(y, 1), o.selector && l.delegateCount-- , c.remove && c.remove.call(n, o));
                    b && !l.length && (c.teardown && c.teardown.call(n, w, v.handle) !== !1 || i.removeEvent(n, e, v.handle), delete a[e])
                } else for (e in a) i.event.remove(n, e + t[p], r, u, !0);
                i.isEmptyObject(a) && (delete v.handle, i._removeData(n, "events"))
            }
        },
        trigger: function (t, r, f, e) {
            var l, a, o, p, c, h, w, y = [f || u], s = tt.call(t, "type") ? t.type : t,
                v = tt.call(t, "namespace") ? t.namespace.split(".") : [];
            if (o = h = f = f || u, 3 !== f.nodeType && 8 !== f.nodeType && !br.test(s + i.event.triggered) && (s.indexOf(".") >= 0 && (v = s.split("."), s = v.shift(), v.sort()), a = s.indexOf(":") < 0 && "on" + s, t = t[i.expando] ? t : new i.Event(s, "object" == typeof t && t), t.isTrigger = e ? 2 : 3, t.namespace = v.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + v.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = f), r = null == r ? [t] : i.makeArray(r, [t]), c = i.event.special[s] || {}, e || !c.trigger || c.trigger.apply(f, r) !== !1)) {
                if (!e && !c.noBubble && !i.isWindow(f)) {
                    for (p = c.delegateType || s, br.test(p + s) || (o = o.parentNode); o; o = o.parentNode) y.push(o), h = o;
                    h === (f.ownerDocument || u) && y.push(h.defaultView || h.parentWindow || n)
                }
                for (w = 0; (o = y[w++]) && !t.isPropagationStopped();) t.type = w > 1 ? p : c.bindType || s, l = (i._data(o, "events") || {})[t.type] && i._data(o, "handle"), l && l.apply(o, r), l = a && o[a], l && l.apply && i.acceptData(o) && (t.result = l.apply(o, r), t.result === !1 && t.preventDefault());
                if (t.type = s, !e && !t.isDefaultPrevented() && (!c._default || c._default.apply(y.pop(), r) === !1) && i.acceptData(f) && a && f[s] && !i.isWindow(f)) {
                    h = f[a];
                    h && (f[a] = null);
                    i.event.triggered = s;
                    try {
                        f[s]()
                    } catch (b) {
                    }
                    i.event.triggered = void 0;
                    h && (f[a] = h)
                }
                return t.result
            }
        },
        dispatch: function (n) {
            n = i.event.fix(n);
            var e, f, t, r, o, s = [], h = l.call(arguments), c = (i._data(this, "events") || {})[n.type] || [],
                u = i.event.special[n.type] || {};
            if (h[0] = n, n.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, n) !== !1) {
                for (s = i.event.handlers.call(this, n, c), e = 0; (r = s[e++]) && !n.isPropagationStopped();) for (n.currentTarget = r.elem, o = 0; (t = r.handlers[o++]) && !n.isImmediatePropagationStopped();) (!n.namespace_re || n.namespace_re.test(t.namespace)) && (n.handleObj = t, n.data = t.data, f = ((i.event.special[t.origType] || {}).handle || t.handler).apply(r.elem, h), void 0 !== f && (n.result = f) === !1 && (n.preventDefault(), n.stopPropagation()));
                return u.postDispatch && u.postDispatch.call(this, n), n.result
            }
        },
        handlers: function (n, t) {
            var f, e, u, o, h = [], s = t.delegateCount, r = n.target;
            if (s && r.nodeType && (!n.button || "click" !== n.type)) for (; r != this; r = r.parentNode || this) if (1 === r.nodeType && (r.disabled !== !0 || "click" !== n.type)) {
                for (u = [], o = 0; s > o; o++) e = t[o], f = e.selector + " ", void 0 === u[f] && (u[f] = e.needsContext ? i(f, this).index(r) >= 0 : i.find(f, this, null, [r]).length), u[f] && u.push(e);
                u.length && h.push({ elem: r, handlers: u })
            }
            return s < t.length && h.push({ elem: this, handlers: t.slice(s) }), h
        },
        fix: function (n) {
            if (n[i.expando]) return n;
            var e, o, s, r = n.type, f = n, t = this.fixHooks[r];
            for (t || (this.fixHooks[r] = t = se.test(r) ? this.mouseHooks : oe.test(r) ? this.keyHooks : {}), s = t.props ? this.props.concat(t.props) : this.props, n = new i.Event(f), e = s.length; e--;) o = s[e], n[o] = f[o];
            return n.target || (n.target = f.srcElement || u), 3 === n.target.nodeType && (n.target = n.target.parentNode), n.metaKey = !!n.metaKey, t.filter ? t.filter(n, f) : n
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "), filter: function (n, t) {
                return null == n.which && (n.which = null != t.charCode ? t.charCode : t.keyCode), n
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (n, t) {
                var i, e, r, f = t.button, o = t.fromElement;
                return null == n.pageX && null != t.clientX && (e = n.target.ownerDocument || u, r = e.documentElement, i = e.body, n.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0), n.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)), !n.relatedTarget && o && (n.relatedTarget = o === n.target ? t.toElement : o), n.which || void 0 === f || (n.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), n
            }
        },
        special: {
            load: { noBubble: !0 }, focus: {
                trigger: function () {
                    if (this !== dr() && this.focus) try {
                        return this.focus(), !1
                    } catch (n) {
                    }
                }, delegateType: "focusin"
            }, blur: {
                trigger: function () {
                    if (this === dr() && this.blur) return (this.blur(), !1)
                }, delegateType: "focusout"
            }, click: {
                trigger: function () {
                    if (i.nodeName(this, "input") && "checkbox" === this.type && this.click) return (this.click(), !1)
                }, _default: function (n) {
                    return i.nodeName(n.target, "a")
                }
            }, beforeunload: {
                postDispatch: function (n) {
                    void 0 !== n.result && n.originalEvent && (n.originalEvent.returnValue = n.result)
                }
            }
        },
        simulate: function (n, t, r, u) {
            var f = i.extend(new i.Event, r, { type: n, isSimulated: !0, originalEvent: {} });
            u ? i.event.trigger(f, null, t) : i.event.dispatch.call(t, f);
            f.isDefaultPrevented() && r.preventDefault()
        }
    };
    i.removeEvent = u.removeEventListener ? function (n, t, i) {
        n.removeEventListener && n.removeEventListener(t, i, !1)
    } : function (n, t, i) {
        var r = "on" + t;
        n.detachEvent && (typeof n[r] === o && (n[r] = null), n.detachEvent(r, i))
    };
    i.Event = function (n, t) {
        return this instanceof i.Event ? (n && n.type ? (this.originalEvent = n, this.type = n.type, this.isDefaultPrevented = n.defaultPrevented || void 0 === n.defaultPrevented && n.returnValue === !1 ? vt : it) : this.type = n, t && i.extend(this, t), this.timeStamp = n && n.timeStamp || i.now(), void (this[i.expando] = !0)) : new i.Event(n, t)
    };
    i.Event.prototype = {
        isDefaultPrevented: it,
        isPropagationStopped: it,
        isImmediatePropagationStopped: it,
        preventDefault: function () {
            var n = this.originalEvent;
            this.isDefaultPrevented = vt;
            n && (n.preventDefault ? n.preventDefault() : n.returnValue = !1)
        },
        stopPropagation: function () {
            var n = this.originalEvent;
            this.isPropagationStopped = vt;
            n && (n.stopPropagation && n.stopPropagation(), n.cancelBubble = !0)
        },
        stopImmediatePropagation: function () {
            var n = this.originalEvent;
            this.isImmediatePropagationStopped = vt;
            n && n.stopImmediatePropagation && n.stopImmediatePropagation();
            this.stopPropagation()
        }
    };
    i.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (n, t) {
        i.event.special[n] = {
            delegateType: t, bindType: t, handle: function (n) {
                var u, f = this, r = n.relatedTarget, e = n.handleObj;
                return (!r || r !== f && !i.contains(f, r)) && (n.type = e.origType, u = e.handler.apply(this, arguments), n.type = t), u
            }
        }
    });
    r.submitBubbles || (i.event.special.submit = {
        setup: function () {
            return i.nodeName(this, "form") ? !1 : void i.event.add(this, "click._submit keypress._submit", function (n) {
                var r = n.target, t = i.nodeName(r, "input") || i.nodeName(r, "button") ? r.form : void 0;
                t && !i._data(t, "submitBubbles") && (i.event.add(t, "submit._submit", function (n) {
                    n._submit_bubble = !0
                }), i._data(t, "submitBubbles", !0))
            })
        }, postDispatch: function (n) {
            n._submit_bubble && (delete n._submit_bubble, this.parentNode && !n.isTrigger && i.event.simulate("submit", this.parentNode, n, !0))
        }, teardown: function () {
            return i.nodeName(this, "form") ? !1 : void i.event.remove(this, "._submit")
        }
    });
    r.changeBubbles || (i.event.special.change = {
        setup: function () {
            return si.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (i.event.add(this, "propertychange._change", function (n) {
                "checked" === n.originalEvent.propertyName && (this._just_changed = !0)
            }), i.event.add(this, "click._change", function (n) {
                this._just_changed && !n.isTrigger && (this._just_changed = !1);
                i.event.simulate("change", this, n, !0)
            })), !1) : void i.event.add(this, "beforeactivate._change", function (n) {
                var t = n.target;
                si.test(t.nodeName) && !i._data(t, "changeBubbles") && (i.event.add(t, "change._change", function (n) {
                    !this.parentNode || n.isSimulated || n.isTrigger || i.event.simulate("change", this.parentNode, n, !0)
                }), i._data(t, "changeBubbles", !0))
            })
        }, handle: function (n) {
            var t = n.target;
            if (this !== t || n.isSimulated || n.isTrigger || "radio" !== t.type && "checkbox" !== t.type) return n.handleObj.handler.apply(this, arguments)
        }, teardown: function () {
            return i.event.remove(this, "._change"), !si.test(this.nodeName)
        }
    });
    r.focusinBubbles || i.each({ focus: "focusin", blur: "focusout" }, function (n, t) {
        var r = function (n) {
            i.event.simulate(t, n.target, i.event.fix(n), !0)
        };
        i.event.special[t] = {
            setup: function () {
                var u = this.ownerDocument || this, f = i._data(u, t);
                f || u.addEventListener(n, r, !0);
                i._data(u, t, (f || 0) + 1)
            }, teardown: function () {
                var u = this.ownerDocument || this, f = i._data(u, t) - 1;
                f ? i._data(u, t, f) : (u.removeEventListener(n, r, !0), i._removeData(u, t))
            }
        }
    });
    i.fn.extend({
        on: function (n, t, r, u, f) {
            var o, e;
            if ("object" == typeof n) {
                "string" != typeof t && (r = r || t, t = void 0);
                for (o in n) this.on(o, t, r, n[o], f);
                return this
            }
            if (null == r && null == u ? (u = t, r = t = void 0) : null == u && ("string" == typeof t ? (u = r, r = void 0) : (u = r, r = t, t = void 0)), u === !1) u = it; else if (!u) return this;
            return 1 === f && (e = u, u = function (n) {
                return i().off(n), e.apply(this, arguments)
            }, u.guid = e.guid || (e.guid = i.guid++)), this.each(function () {
                i.event.add(this, n, u, r, t)
            })
        }, one: function (n, t, i, r) {
            return this.on(n, t, i, r, 1)
        }, off: function (n, t, r) {
            var u, f;
            if (n && n.preventDefault && n.handleObj) return u = n.handleObj, i(n.delegateTarget).off(u.namespace ? u.origType + "." + u.namespace : u.origType, u.selector, u.handler), this;
            if ("object" == typeof n) {
                for (f in n) this.off(f, t, n[f]);
                return this
            }
            return (t === !1 || "function" == typeof t) && (r = t, t = void 0), r === !1 && (r = it), this.each(function () {
                i.event.remove(this, n, r, t)
            })
        }, trigger: function (n, t) {
            return this.each(function () {
                i.event.trigger(n, t, this)
            })
        }, triggerHandler: function (n, t) {
            var r = this[0];
            if (r) return i.event.trigger(n, t, r, !0)
        }
    });
    var nu = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        he = / jQuery\d+="(?:null|\d+)"/g, tu = new RegExp("<(?:" + nu + ")[\\s/>]", "i"), hi = /^\s+/,
        iu = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, ru = /<([\w:]+)/,
        uu = /<tbody/i, ce = /<|&#?\w+;/, le = /<(?:script|style|link)/i, ae = /checked\s*(?:[^=]|=\s*.checked.)/i,
        fu = /^$|\/(?:java|ecma)script/i, ve = /^true\/(.*)/, ye = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, s = {
            option: [1, "<select multiple='multiple'>", "<\/select>"],
            legend: [1, "<fieldset>", "<\/fieldset>"],
            area: [1, "<map>", "<\/map>"],
            param: [1, "<object>", "<\/object>"],
            thead: [1, "<table>", "<\/table>"],
            tr: [2, "<table><tbody>", "<\/tbody><\/table>"],
            col: [2, "<table><tbody><\/tbody><colgroup>", "<\/colgroup><\/table>"],
            td: [3, "<table><tbody><tr>", "<\/tr><\/tbody><\/table>"],
            _default: r.htmlSerialize ? [0, "", ""] : [1, "X<div>", "<\/div>"]
        }, pe = gr(u), ci = pe.appendChild(u.createElement("div"));
    s.optgroup = s.option;
    s.tbody = s.tfoot = s.colgroup = s.caption = s.thead;
    s.th = s.td;
    i.extend({
        clone: function (n, t, u) {
            var e, c, s, o, h, l = i.contains(n.ownerDocument, n);
            if (r.html5Clone || i.isXMLDoc(n) || !tu.test("<" + n.nodeName + ">") ? s = n.cloneNode(!0) : (ci.innerHTML = n.outerHTML, ci.removeChild(s = ci.firstChild)), !(r.noCloneEvent && r.noCloneChecked || 1 !== n.nodeType && 11 !== n.nodeType || i.isXMLDoc(n))) for (e = f(s), h = f(n), o = 0; null != (c = h[o]); ++o) e[o] && be(c, e[o]);
            if (t) if (u) for (h = h || f(n), e = e || f(s), o = 0; null != (c = h[o]); o++) hu(c, e[o]); else hu(n, s);
            return e = f(s, "script"), e.length > 0 && li(e, !l && f(n, "script")), e = h = c = null, s
        }, buildFragment: function (n, t, u, e) {
            for (var c, o, b, h, p, w, a, k = n.length, v = gr(t), l = [], y = 0; k > y; y++) if (o = n[y], o || 0 === o) if ("object" === i.type(o)) i.merge(l, o.nodeType ? [o] : o); else if (ce.test(o)) {
                for (h = h || v.appendChild(t.createElement("div")), p = (ru.exec(o) || ["", ""])[1].toLowerCase(), a = s[p] || s._default, h.innerHTML = a[1] + o.replace(iu, "<$1><\/$2>") + a[2], c = a[0]; c--;) h = h.lastChild;
                if (!r.leadingWhitespace && hi.test(o) && l.push(t.createTextNode(hi.exec(o)[0])), !r.tbody) for (o = "table" !== p || uu.test(o) ? "<table>" !== a[1] || uu.test(o) ? 0 : h : h.firstChild, c = o && o.childNodes.length; c--;) i.nodeName(w = o.childNodes[c], "tbody") && !w.childNodes.length && o.removeChild(w);
                for (i.merge(l, h.childNodes), h.textContent = ""; h.firstChild;) h.removeChild(h.firstChild);
                h = v.lastChild
            } else l.push(t.createTextNode(o));
            for (h && v.removeChild(h), r.appendChecked || i.grep(f(l, "input"), we), y = 0; o = l[y++];) if ((!e || -1 === i.inArray(o, e)) && (b = i.contains(o.ownerDocument, o), h = f(v.appendChild(o), "script"), b && li(h), u)) for (c = 0; o = h[c++];) fu.test(o.type || "") && u.push(o);
            return h = null, v
        }, cleanData: function (n, t) {
            for (var u, e, f, s, a = 0, h = i.expando, l = i.cache, v = r.deleteExpando, y = i.event.special; null != (u = n[a]); a++) if ((t || i.acceptData(u)) && (f = u[h], s = f && l[f])) {
                if (s.events) for (e in s.events) y[e] ? i.event.remove(u, e) : i.removeEvent(u, e, s.handle);
                l[f] && (delete l[f], v ? delete u[h] : typeof u.removeAttribute !== o ? u.removeAttribute(h) : u[h] = null, c.push(f))
            }
        }
    });
    i.fn.extend({
        text: function (n) {
            return b(this, function (n) {
                return void 0 === n ? i.text(this) : this.empty().append((this[0] && this[0].ownerDocument || u).createTextNode(n))
            }, null, n, arguments.length)
        }, append: function () {
            return this.domManip(arguments, function (n) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = eu(this, n);
                    t.appendChild(n)
                }
            })
        }, prepend: function () {
            return this.domManip(arguments, function (n) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = eu(this, n);
                    t.insertBefore(n, t.firstChild)
                }
            })
        }, before: function () {
            return this.domManip(arguments, function (n) {
                this.parentNode && this.parentNode.insertBefore(n, this)
            })
        }, after: function () {
            return this.domManip(arguments, function (n) {
                this.parentNode && this.parentNode.insertBefore(n, this.nextSibling)
            })
        }, remove: function (n, t) {
            for (var r, e = n ? i.filter(n, this) : this, u = 0; null != (r = e[u]); u++) t || 1 !== r.nodeType || i.cleanData(f(r)), r.parentNode && (t && i.contains(r.ownerDocument, r) && li(f(r, "script")), r.parentNode.removeChild(r));
            return this
        }, empty: function () {
            for (var n, t = 0; null != (n = this[t]); t++) {
                for (1 === n.nodeType && i.cleanData(f(n, !1)); n.firstChild;) n.removeChild(n.firstChild);
                n.options && i.nodeName(n, "select") && (n.options.length = 0)
            }
            return this
        }, clone: function (n, t) {
            return n = null == n ? !1 : n, t = null == t ? n : t, this.map(function () {
                return i.clone(this, n, t)
            })
        }, html: function (n) {
            return b(this, function (n) {
                var t = this[0] || {}, u = 0, e = this.length;
                if (void 0 === n) return 1 === t.nodeType ? t.innerHTML.replace(he, "") : void 0;
                if (!("string" != typeof n || le.test(n) || !r.htmlSerialize && tu.test(n) || !r.leadingWhitespace && hi.test(n) || s[(ru.exec(n) || ["", ""])[1].toLowerCase()])) {
                    n = n.replace(iu, "<$1><\/$2>");
                    try {
                        for (; e > u; u++) t = this[u] || {}, 1 === t.nodeType && (i.cleanData(f(t, !1)), t.innerHTML = n);
                        t = 0
                    } catch (o) {
                    }
                }
                t && this.empty().append(n)
            }, null, n, arguments.length)
        }, replaceWith: function () {
            var n = arguments[0];
            return this.domManip(arguments, function (t) {
                n = this.parentNode;
                i.cleanData(f(this));
                n && n.replaceChild(t, this)
            }), n && (n.length || n.nodeType) ? this : this.remove()
        }, detach: function (n) {
            return this.remove(n, !0)
        }, domManip: function (n, t) {
            n = ir.apply([], n);
            var h, u, c, o, v, s, e = 0, l = this.length, p = this, w = l - 1, a = n[0], y = i.isFunction(a);
            if (y || l > 1 && "string" == typeof a && !r.checkClone && ae.test(a)) return this.each(function (i) {
                var r = p.eq(i);
                y && (n[0] = a.call(this, i, r.html()));
                r.domManip(n, t)
            });
            if (l && (s = i.buildFragment(n, this[0].ownerDocument, !1, this), h = s.firstChild, 1 === s.childNodes.length && (s = h), h)) {
                for (o = i.map(f(s, "script"), ou), c = o.length; l > e; e++) u = s, e !== w && (u = i.clone(u, !0, !0), c && i.merge(o, f(u, "script"))), t.call(this[e], u, e);
                if (c) for (v = o[o.length - 1].ownerDocument, i.map(o, su), e = 0; c > e; e++) u = o[e], fu.test(u.type || "") && !i._data(u, "globalEval") && i.contains(v, u) && (u.src ? i._evalUrl && i._evalUrl(u.src) : i.globalEval((u.text || u.textContent || u.innerHTML || "").replace(ye, "")));
                s = h = null
            }
            return this
        }
    });
    i.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (n, t) {
        i.fn[n] = function (n) {
            for (var u, r = 0, f = [], e = i(n), o = e.length - 1; o >= r; r++) u = r === o ? this : this.clone(!0), i(e[r])[t](u), ii.apply(f, u.get());
            return this.pushStack(f)
        }
    });
    ai = {};
    !function () {
        var n;
        r.shrinkWrapBlocks = function () {
            if (null != n) return n;
            n = !1;
            var t, i, r;
            return i = u.getElementsByTagName("body")[0], i && i.style ? (t = u.createElement("div"), r = u.createElement("div"), r.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", i.appendChild(r).appendChild(t), typeof t.style.zoom !== o && (t.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", t.appendChild(u.createElement("div")).style.width = "5px", n = 3 !== t.offsetWidth), i.removeChild(r), n) : void 0
        }
    }();
    var lu = /^margin/, pt = new RegExp("^(" + at + ")(?!px)[a-z%]+$", "i"), k, d, ke = /^(top|right|bottom|left)$/;
    n.getComputedStyle ? (k = function (n) {
        return n.ownerDocument.defaultView.getComputedStyle(n, null)
    }, d = function (n, t, r) {
        var e, o, s, u, f = n.style;
        return r = r || k(n), u = r ? r.getPropertyValue(t) || r[t] : void 0, r && ("" !== u || i.contains(n.ownerDocument, n) || (u = i.style(n, t)), pt.test(u) && lu.test(t) && (e = f.width, o = f.minWidth, s = f.maxWidth, f.minWidth = f.maxWidth = f.width = u, u = r.width, f.width = e, f.minWidth = o, f.maxWidth = s)), void 0 === u ? u : u + ""
    }) : u.documentElement.currentStyle && (k = function (n) {
        return n.currentStyle
    }, d = function (n, t, i) {
        var o, f, e, r, u = n.style;
        return i = i || k(n), r = i ? i[t] : void 0, null == r && u && u[t] && (r = u[t]), pt.test(r) && !ke.test(t) && (o = u.left, f = n.runtimeStyle, e = f && f.left, e && (f.left = n.currentStyle.left), u.left = "fontSize" === t ? "1em" : r, r = u.pixelLeft + "px", u.left = o, e && (f.left = e)), void 0 === r ? r : r + "" || "auto"
    });
    !function () {
        var f, t, c, o, s, e, h;
        if (f = u.createElement("div"), f.innerHTML = "  <link/><table><\/table><a href='/a'>a<\/a><input type='checkbox'/>", c = f.getElementsByTagName("a")[0], t = c && c.style) {
            t.cssText = "float:left;opacity:.5";
            r.opacity = "0.5" === t.opacity;
            r.cssFloat = !!t.cssFloat;
            f.style.backgroundClip = "content-box";
            f.cloneNode(!0).style.backgroundClip = "";
            r.clearCloneStyle = "content-box" === f.style.backgroundClip;
            r.boxSizing = "" === t.boxSizing || "" === t.MozBoxSizing || "" === t.WebkitBoxSizing;
            i.extend(r, {
                reliableHiddenOffsets: function () {
                    return null == e && c(), e
                }, boxSizingReliable: function () {
                    return null == s && c(), s
                }, pixelPosition: function () {
                    return null == o && c(), o
                }, reliableMarginRight: function () {
                    return null == h && c(), h
                }
            });

            function c() {
                var i, r, f, t;
                r = u.getElementsByTagName("body")[0];
                r && r.style && (i = u.createElement("div"), f = u.createElement("div"), f.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", r.appendChild(f).appendChild(i), i.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", o = s = !1, h = !0, n.getComputedStyle && (o = "1%" !== (n.getComputedStyle(i, null) || {}).top, s = "4px" === (n.getComputedStyle(i, null) || { width: "4px" }).width, t = i.appendChild(u.createElement("div")), t.style.cssText = i.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", t.style.marginRight = t.style.width = "0", i.style.width = "1px", h = !parseFloat((n.getComputedStyle(t, null) || {}).marginRight)), i.innerHTML = "<table><tr><td><\/td><td>t<\/td><\/tr><\/table>", t = i.getElementsByTagName("td"), t[0].style.cssText = "margin:0;border:0;padding:0;display:none", e = 0 === t[0].offsetHeight, e && (t[0].style.display = "", t[1].style.display = "none", e = 0 === t[0].offsetHeight), r.removeChild(f))
            }
        }
    }();
    i.swap = function (n, t, i, r) {
        var f, u, e = {};
        for (u in t) e[u] = n.style[u], n.style[u] = t[u];
        f = i.apply(n, r || []);
        for (u in t) n.style[u] = e[u];
        return f
    };
    var vi = /alpha\([^)]*\)/i, de = /opacity\s*=\s*([^)]*)/, ge = /^(none|table(?!-c[ea]).+)/,
        no = new RegExp("^(" + at + ")(.*)$", "i"), to = new RegExp("^([+-])=(" + at + ")", "i"),
        io = { position: "absolute", visibility: "hidden", display: "block" },
        vu = { letterSpacing: "0", fontWeight: "400" }, yu = ["Webkit", "O", "Moz", "ms"];
    i.extend({
        cssHooks: {
            opacity: {
                get: function (n, t) {
                    if (t) {
                        var i = d(n, "opacity");
                        return "" === i ? "1" : i
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: { float: r.cssFloat ? "cssFloat" : "styleFloat" },
        style: function (n, t, u, f) {
            if (n && 3 !== n.nodeType && 8 !== n.nodeType && n.style) {
                var o, h, e, s = i.camelCase(t), c = n.style;
                if (t = i.cssProps[s] || (i.cssProps[s] = pu(c, s)), e = i.cssHooks[t] || i.cssHooks[s], void 0 === u) return e && "get" in e && void 0 !== (o = e.get(n, !1, f)) ? o : c[t];
                if (h = typeof u, "string" === h && (o = to.exec(u)) && (u = (o[1] + 1) * o[2] + parseFloat(i.css(n, t)), h = "number"), null != u && u === u && ("number" !== h || i.cssNumber[s] || (u += "px"), r.clearCloneStyle || "" !== u || 0 !== t.indexOf("background") || (c[t] = "inherit"), !(e && "set" in e && void 0 === (u = e.set(n, u, f))))) try {
                    c[t] = u
                } catch (l) {
                }
            }
        },
        css: function (n, t, r, u) {
            var s, f, e, o = i.camelCase(t);
            return t = i.cssProps[o] || (i.cssProps[o] = pu(n.style, o)), e = i.cssHooks[t] || i.cssHooks[o], e && "get" in e && (f = e.get(n, !0, r)), void 0 === f && (f = d(n, t, u)), "normal" === f && t in vu && (f = vu[t]), "" === r || r ? (s = parseFloat(f), r === !0 || i.isNumeric(s) ? s || 0 : f) : f
        }
    });
    i.each(["height", "width"], function (n, t) {
        i.cssHooks[t] = {
            get: function (n, r, u) {
                if (r) return ge.test(i.css(n, "display")) && 0 === n.offsetWidth ? i.swap(n, io, function () {
                    return du(n, t, u)
                }) : du(n, t, u)
            }, set: function (n, u, f) {
                var e = f && k(n);
                return bu(n, u, f ? ku(n, t, f, r.boxSizing && "border-box" === i.css(n, "boxSizing", !1, e), e) : 0)
            }
        }
    });
    r.opacity || (i.cssHooks.opacity = {
        get: function (n, t) {
            return de.test((t && n.currentStyle ? n.currentStyle.filter : n.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        }, set: function (n, t) {
            var r = n.style, u = n.currentStyle, e = i.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "",
                f = u && u.filter || r.filter || "";
            r.zoom = 1;
            (t >= 1 || "" === t) && "" === i.trim(f.replace(vi, "")) && r.removeAttribute && (r.removeAttribute("filter"), "" === t || u && !u.filter) || (r.filter = vi.test(f) ? f.replace(vi, e) : f + " " + e)
        }
    });
    i.cssHooks.marginRight = au(r.reliableMarginRight, function (n, t) {
        if (t) return i.swap(n, { display: "inline-block" }, d, [n, "marginRight"])
    });
    i.each({ margin: "", padding: "", border: "Width" }, function (n, t) {
        i.cssHooks[n + t] = {
            expand: function (i) {
                for (var r = 0, f = {}, u = "string" == typeof i ? i.split(" ") : [i]; 4 > r; r++) f[n + w[r] + t] = u[r] || u[r - 2] || u[0];
                return f
            }
        };
        lu.test(n) || (i.cssHooks[n + t].set = bu)
    });
    i.fn.extend({
        css: function (n, t) {
            return b(this, function (n, t, r) {
                var f, e, o = {}, u = 0;
                if (i.isArray(t)) {
                    for (f = k(n), e = t.length; e > u; u++) o[t[u]] = i.css(n, t[u], !1, f);
                    return o
                }
                return void 0 !== r ? i.style(n, t, r) : i.css(n, t)
            }, n, t, arguments.length > 1)
        }, show: function () {
            return wu(this, !0)
        }, hide: function () {
            return wu(this)
        }, toggle: function (n) {
            return "boolean" == typeof n ? n ? this.show() : this.hide() : this.each(function () {
                et(this) ? i(this).show() : i(this).hide()
            })
        }
    });
    i.Tween = e;
    e.prototype = {
        constructor: e, init: function (n, t, r, u, f, e) {
            this.elem = n;
            this.prop = r;
            this.easing = f || "swing";
            this.options = t;
            this.start = this.now = this.cur();
            this.end = u;
            this.unit = e || (i.cssNumber[r] ? "" : "px")
        }, cur: function () {
            var n = e.propHooks[this.prop];
            return n && n.get ? n.get(this) : e.propHooks._default.get(this)
        }, run: function (n) {
            var r, t = e.propHooks[this.prop];
            return this.pos = r = this.options.duration ? i.easing[this.easing](n, this.options.duration * n, 0, 1, this.options.duration) : n, this.now = (this.end - this.start) * r + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), t && t.set ? t.set(this) : e.propHooks._default.set(this), this
        }
    };
    e.prototype.init.prototype = e.prototype;
    e.propHooks = {
        _default: {
            get: function (n) {
                var t;
                return null == n.elem[n.prop] || n.elem.style && null != n.elem.style[n.prop] ? (t = i.css(n.elem, n.prop, ""), t && "auto" !== t ? t : 0) : n.elem[n.prop]
            }, set: function (n) {
                i.fx.step[n.prop] ? i.fx.step[n.prop](n) : n.elem.style && (null != n.elem.style[i.cssProps[n.prop]] || i.cssHooks[n.prop]) ? i.style(n.elem, n.prop, n.now + n.unit) : n.elem[n.prop] = n.now
            }
        }
    };
    e.propHooks.scrollTop = e.propHooks.scrollLeft = {
        set: function (n) {
            n.elem.nodeType && n.elem.parentNode && (n.elem[n.prop] = n.now)
        }
    };
    i.easing = {
        linear: function (n) {
            return n
        }, swing: function (n) {
            return .5 - Math.cos(n * Math.PI) / 2
        }
    };
    i.fx = e.prototype.init;
    i.fx.step = {};
    var rt, wt, ro = /^(?:toggle|show|hide)$/, gu = new RegExp("^(?:([+-])=|)(" + at + ")([a-z%]*)$", "i"),
        uo = /queueHooks$/, bt = [fo], st = {
            "*": [function (n, t) {
                var f = this.createTween(n, t), s = f.cur(), r = gu.exec(t), e = r && r[3] || (i.cssNumber[n] ? "" : "px"),
                    u = (i.cssNumber[n] || "px" !== e && +s) && gu.exec(i.css(f.elem, n)), o = 1, h = 20;
                if (u && u[3] !== e) {
                    e = e || u[3];
                    r = r || [];
                    u = +s || 1;
                    do o = o || ".5", u /= o, i.style(f.elem, n, u + e); while (o !== (o = f.cur() / s) && 1 !== o && --h)
                }
                return r && (u = f.start = +u || +s || 0, f.unit = e, f.end = r[1] ? u + (r[1] + 1) * r[2] : +r[2]), f
            }]
        };
    i.Animation = i.extend(rf, {
        tweener: function (n, t) {
            i.isFunction(n) ? (t = n, n = ["*"]) : n = n.split(" ");
            for (var r, u = 0, f = n.length; f > u; u++) r = n[u], st[r] = st[r] || [], st[r].unshift(t)
        }, prefilter: function (n, t) {
            t ? bt.unshift(n) : bt.push(n)
        }
    });
    i.speed = function (n, t, r) {
        var u = n && "object" == typeof n ? i.extend({}, n) : {
            complete: r || !r && t || i.isFunction(n) && n,
            duration: n,
            easing: r && t || t && !i.isFunction(t) && t
        };
        return u.duration = i.fx.off ? 0 : "number" == typeof u.duration ? u.duration : u.duration in i.fx.speeds ? i.fx.speeds[u.duration] : i.fx.speeds._default, (null == u.queue || u.queue === !0) && (u.queue = "fx"), u.old = u.complete, u.complete = function () {
            i.isFunction(u.old) && u.old.call(this);
            u.queue && i.dequeue(this, u.queue)
        }, u
    };
    i.fn.extend({
        fadeTo: function (n, t, i, r) {
            return this.filter(et).css("opacity", 0).show().end().animate({ opacity: t }, n, i, r)
        }, animate: function (n, t, r, u) {
            var o = i.isEmptyObject(n), e = i.speed(t, r, u), f = function () {
                var t = rf(this, i.extend({}, n), e);
                (o || i._data(this, "finish")) && t.stop(!0)
            };
            return f.finish = f, o || e.queue === !1 ? this.each(f) : this.queue(e.queue, f)
        }, stop: function (n, t, r) {
            var u = function (n) {
                var t = n.stop;
                delete n.stop;
                t(r)
            };
            return "string" != typeof n && (r = t, t = n, n = void 0), t && n !== !1 && this.queue(n || "fx", []), this.each(function () {
                var o = !0, t = null != n && n + "queueHooks", e = i.timers, f = i._data(this);
                if (t) f[t] && f[t].stop && u(f[t]); else for (t in f) f[t] && f[t].stop && uo.test(t) && u(f[t]);
                for (t = e.length; t--;) e[t].elem !== this || null != n && e[t].queue !== n || (e[t].anim.stop(r), o = !1, e.splice(t, 1));
                (o || !r) && i.dequeue(this, n)
            })
        }, finish: function (n) {
            return n !== !1 && (n = n || "fx"), this.each(function () {
                var t, f = i._data(this), r = f[n + "queue"], e = f[n + "queueHooks"], u = i.timers,
                    o = r ? r.length : 0;
                for (f.finish = !0, i.queue(this, n, []), e && e.stop && e.stop.call(this, !0), t = u.length; t--;) u[t].elem === this && u[t].queue === n && (u[t].anim.stop(!0), u.splice(t, 1));
                for (t = 0; o > t; t++) r[t] && r[t].finish && r[t].finish.call(this);
                delete f.finish
            })
        }
    });
    i.each(["toggle", "show", "hide"], function (n, t) {
        var r = i.fn[t];
        i.fn[t] = function (n, i, u) {
            return null == n || "boolean" == typeof n ? r.apply(this, arguments) : this.animate(kt(t, !0), n, i, u)
        }
    });
    i.each({
        slideDown: kt("show"),
        slideUp: kt("hide"),
        slideToggle: kt("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" }
    }, function (n, t) {
        i.fn[n] = function (n, i, r) {
            return this.animate(t, n, i, r)
        }
    });
    i.timers = [];
    i.fx.tick = function () {
        var r, n = i.timers, t = 0;
        for (rt = i.now(); t < n.length; t++) r = n[t], r() || n[t] !== r || n.splice(t--, 1);
        n.length || i.fx.stop();
        rt = void 0
    };
    i.fx.timer = function (n) {
        i.timers.push(n);
        n() ? i.fx.start() : i.timers.pop()
    };
    i.fx.interval = 13;
    i.fx.start = function () {
        wt || (wt = setInterval(i.fx.tick, i.fx.interval))
    };
    i.fx.stop = function () {
        clearInterval(wt);
        wt = null
    };
    i.fx.speeds = { slow: 600, fast: 200, _default: 400 };
    i.fn.delay = function (n, t) {
        return n = i.fx ? i.fx.speeds[n] || n : n, t = t || "fx", this.queue(t, function (t, i) {
            var r = setTimeout(t, n);
            i.stop = function () {
                clearTimeout(r)
            }
        })
    }, function () {
        var n, t, f, i, e;
        t = u.createElement("div");
        t.setAttribute("className", "t");
        t.innerHTML = "  <link/><table><\/table><a href='/a'>a<\/a><input type='checkbox'/>";
        i = t.getElementsByTagName("a")[0];
        f = u.createElement("select");
        e = f.appendChild(u.createElement("option"));
        n = t.getElementsByTagName("input")[0];
        i.style.cssText = "top:1px";
        r.getSetAttribute = "t" !== t.className;
        r.style = /top/.test(i.getAttribute("style"));
        r.hrefNormalized = "/a" === i.getAttribute("href");
        r.checkOn = !!n.value;
        r.optSelected = e.selected;
        r.enctype = !!u.createElement("form").enctype;
        f.disabled = !0;
        r.optDisabled = !e.disabled;
        n = u.createElement("input");
        n.setAttribute("value", "");
        r.input = "" === n.getAttribute("value");
        n.value = "t";
        n.setAttribute("type", "radio");
        r.radioValue = "t" === n.value
    }();
    uf = /\r/g;
    i.fn.extend({
        val: function (n) {
            var t, r, f, u = this[0];
            return arguments.length ? (f = i.isFunction(n), this.each(function (r) {
                var u;
                1 === this.nodeType && (u = f ? n.call(this, r, i(this).val()) : n, null == u ? u = "" : "number" == typeof u ? u += "" : i.isArray(u) && (u = i.map(u, function (n) {
                    return null == n ? "" : n + ""
                })), t = i.valHooks[this.type] || i.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, u, "value") || (this.value = u))
            })) : u ? (t = i.valHooks[u.type] || i.valHooks[u.nodeName.toLowerCase()], t && "get" in t && void 0 !== (r = t.get(u, "value")) ? r : (r = u.value, "string" == typeof r ? r.replace(uf, "") : null == r ? "" : r)) : void 0
        }
    });
    i.extend({
        valHooks: {
            option: {
                get: function (n) {
                    var t = i.find.attr(n, "value");
                    return null != t ? t : i.trim(i.text(n))
                }
            }, select: {
                get: function (n) {
                    for (var o, t, s = n.options, u = n.selectedIndex, f = "select-one" === n.type || 0 > u, h = f ? null : [], c = f ? u + 1 : s.length, e = 0 > u ? c : f ? u : 0; c > e; e++) if (t = s[e], !(!t.selected && e !== u || (r.optDisabled ? t.disabled : null !== t.getAttribute("disabled")) || t.parentNode.disabled && i.nodeName(t.parentNode, "optgroup"))) {
                        if (o = i(t).val(), f) return o;
                        h.push(o)
                    }
                    return h
                }, set: function (n, t) {
                    for (var f, r, u = n.options, o = i.makeArray(t), e = u.length; e--;) if (r = u[e], i.inArray(i.valHooks.option.get(r), o) >= 0) try {
                        r.selected = f = !0
                    } catch (s) {
                        r.scrollHeight
                    } else r.selected = !1;
                    return f || (n.selectedIndex = -1), u
                }
            }
        }
    });
    i.each(["radio", "checkbox"], function () {
        i.valHooks[this] = {
            set: function (n, t) {
                if (i.isArray(t)) return n.checked = i.inArray(i(n).val(), t) >= 0
            }
        };
        r.checkOn || (i.valHooks[this].get = function (n) {
            return null === n.getAttribute("value") ? "on" : n.value
        })
    });
    var ut, ff, v = i.expr.attrHandle, yi = /^(?:checked|selected)$/i, g = r.getSetAttribute, dt = r.input;
    i.fn.extend({
        attr: function (n, t) {
            return b(this, i.attr, n, t, arguments.length > 1)
        }, removeAttr: function (n) {
            return this.each(function () {
                i.removeAttr(this, n)
            })
        }
    });
    i.extend({
        attr: function (n, t, r) {
            var u, f, e = n.nodeType;
            if (n && 3 !== e && 8 !== e && 2 !== e) return typeof n.getAttribute === o ? i.prop(n, t, r) : (1 === e && i.isXMLDoc(n) || (t = t.toLowerCase(), u = i.attrHooks[t] || (i.expr.match.bool.test(t) ? ff : ut)), void 0 === r ? u && "get" in u && null !== (f = u.get(n, t)) ? f : (f = i.find.attr(n, t), null == f ? void 0 : f) : null !== r ? u && "set" in u && void 0 !== (f = u.set(n, r, t)) ? f : (n.setAttribute(t, r + ""), r) : void i.removeAttr(n, t))
        }, removeAttr: function (n, t) {
            var r, u, e = 0, f = t && t.match(h);
            if (f && 1 === n.nodeType) while (r = f[e++]) u = i.propFix[r] || r, i.expr.match.bool.test(r) ? dt && g || !yi.test(r) ? n[u] = !1 : n[i.camelCase("default-" + r)] = n[u] = !1 : i.attr(n, r, ""), n.removeAttribute(g ? r : u)
        }, attrHooks: {
            type: {
                set: function (n, t) {
                    if (!r.radioValue && "radio" === t && i.nodeName(n, "input")) {
                        var u = n.value;
                        return n.setAttribute("type", t), u && (n.value = u), t
                    }
                }
            }
        }
    });
    ff = {
        set: function (n, t, r) {
            return t === !1 ? i.removeAttr(n, r) : dt && g || !yi.test(r) ? n.setAttribute(!g && i.propFix[r] || r, r) : n[i.camelCase("default-" + r)] = n[r] = !0, r
        }
    };
    i.each(i.expr.match.bool.source.match(/\w+/g), function (n, t) {
        var r = v[t] || i.find.attr;
        v[t] = dt && g || !yi.test(t) ? function (n, t, i) {
            var u, f;
            return i || (f = v[t], v[t] = u, u = null != r(n, t, i) ? t.toLowerCase() : null, v[t] = f), u
        } : function (n, t, r) {
            if (!r) return n[i.camelCase("default-" + t)] ? t.toLowerCase() : null
        }
    });
    dt && g || (i.attrHooks.value = {
        set: function (n, t, r) {
            return i.nodeName(n, "input") ? void (n.defaultValue = t) : ut && ut.set(n, t, r)
        }
    });
    g || (ut = {
        set: function (n, t, i) {
            var r = n.getAttributeNode(i);
            return r || n.setAttributeNode(r = n.ownerDocument.createAttribute(i)), r.value = t += "", "value" === i || t === n.getAttribute(i) ? t : void 0
        }
    }, v.id = v.name = v.coords = function (n, t, i) {
        var r;
        if (!i) return (r = n.getAttributeNode(t)) && "" !== r.value ? r.value : null
    }, i.valHooks.button = {
        get: function (n, t) {
            var i = n.getAttributeNode(t);
            if (i && i.specified) return i.value
        }, set: ut.set
    }, i.attrHooks.contenteditable = {
        set: function (n, t, i) {
            ut.set(n, "" === t ? !1 : t, i)
        }
    }, i.each(["width", "height"], function (n, t) {
        i.attrHooks[t] = {
            set: function (n, i) {
                if ("" === i) return (n.setAttribute(t, "auto"), i)
            }
        }
    }));
    r.style || (i.attrHooks.style = {
        get: function (n) {
            return n.style.cssText || void 0
        }, set: function (n, t) {
            return n.style.cssText = t + ""
        }
    });
    ef = /^(?:input|select|textarea|button|object)$/i;
    of = /^(?:a|area)$/i;
    i.fn.extend({
        prop: function (n, t) {
            return b(this, i.prop, n, t, arguments.length > 1)
        }, removeProp: function (n) {
            return n = i.propFix[n] || n, this.each(function () {
                try {
                    this[n] = void 0;
                    delete this[n]
                } catch (t) {
                }
            })
        }
    });
    i.extend({
        propFix: { "for": "htmlFor", "class": "className" }, prop: function (n, t, r) {
            var f, u, o, e = n.nodeType;
            if (n && 3 !== e && 8 !== e && 2 !== e) return o = 1 !== e || !i.isXMLDoc(n), o && (t = i.propFix[t] || t, u = i.propHooks[t]), void 0 !== r ? u && "set" in u && void 0 !== (f = u.set(n, r, t)) ? f : n[t] = r : u && "get" in u && null !== (f = u.get(n, t)) ? f : n[t]
        }, propHooks: {
            tabIndex: {
                get: function (n) {
                    var t = i.find.attr(n, "tabindex");
                    return t ? parseInt(t, 10) : ef.test(n.nodeName) || of.test(n.nodeName) && n.href ? 0 : -1
                }
            }
        }
    });
    r.hrefNormalized || i.each(["href", "src"], function (n, t) {
        i.propHooks[t] = {
            get: function (n) {
                return n.getAttribute(t, 4)
            }
        }
    });
    r.optSelected || (i.propHooks.selected = {
        get: function (n) {
            var t = n.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    });
    i.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        i.propFix[this.toLowerCase()] = this
    });
    r.enctype || (i.propFix.enctype = "encoding");
    gt = /[\t\r\n\f]/g;
    i.fn.extend({
        addClass: function (n) {
            var o, t, r, u, s, f, e = 0, c = this.length, l = "string" == typeof n && n;
            if (i.isFunction(n)) return this.each(function (t) {
                i(this).addClass(n.call(this, t, this.className))
            });
            if (l) for (o = (n || "").match(h) || []; c > e; e++) if (t = this[e], r = 1 === t.nodeType && (t.className ? (" " + t.className + " ").replace(gt, " ") : " ")) {
                for (s = 0; u = o[s++];) r.indexOf(" " + u + " ") < 0 && (r += u + " ");
                f = i.trim(r);
                t.className !== f && (t.className = f)
            }
            return this
        }, removeClass: function (n) {
            var o, t, r, u, s, f, e = 0, c = this.length, l = 0 === arguments.length || "string" == typeof n && n;
            if (i.isFunction(n)) return this.each(function (t) {
                i(this).removeClass(n.call(this, t, this.className))
            });
            if (l) for (o = (n || "").match(h) || []; c > e; e++) if (t = this[e], r = 1 === t.nodeType && (t.className ? (" " + t.className + " ").replace(gt, " ") : "")) {
                for (s = 0; u = o[s++];) while (r.indexOf(" " + u + " ") >= 0) r = r.replace(" " + u + " ", " ");
                f = n ? i.trim(r) : "";
                t.className !== f && (t.className = f)
            }
            return this
        }, toggleClass: function (n, t) {
            var r = typeof n;
            return "boolean" == typeof t && "string" === r ? t ? this.addClass(n) : this.removeClass(n) : this.each(i.isFunction(n) ? function (r) {
                i(this).toggleClass(n.call(this, r, this.className, t), t)
            } : function () {
                if ("string" === r) for (var t, f = 0, u = i(this), e = n.match(h) || []; t = e[f++];) u.hasClass(t) ? u.removeClass(t) : u.addClass(t); else (r === o || "boolean" === r) && (this.className && i._data(this, "__className__", this.className), this.className = this.className || n === !1 ? "" : i._data(this, "__className__") || "")
            })
        }, hasClass: function (n) {
            for (var i = " " + n + " ", t = 0, r = this.length; r > t; t++) if (1 === this[t].nodeType && (" " + this[t].className + " ").replace(gt, " ").indexOf(i) >= 0) return !0;
            return !1
        }
    });
    i.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (n, t) {
        i.fn[t] = function (n, i) {
            return arguments.length > 0 ? this.on(t, null, n, i) : this.trigger(t)
        }
    });
    i.fn.extend({
        hover: function (n, t) {
            return this.mouseenter(n).mouseleave(t || n)
        }, bind: function (n, t, i) {
            return this.on(n, null, t, i)
        }, unbind: function (n, t) {
            return this.off(n, null, t)
        }, delegate: function (n, t, i, r) {
            return this.on(t, n, i, r)
        }, undelegate: function (n, t, i) {
            return 1 === arguments.length ? this.off(n, "**") : this.off(t, n || "**", i)
        }
    });
    var pi = i.now(), wi = /\?/,
        oo = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    i.parseJSON = function (t) {
        if (n.JSON && n.JSON.parse) return n.JSON.parse(t + "");
        var f, r = null, u = i.trim(t + "");
        return u && !i.trim(u.replace(oo, function (n, t, i, u) {
            return f && t && (r = 0), 0 === r ? n : (f = i || t, r += !u - !i, "")
        })) ? Function("return " + u)() : i.error("Invalid JSON: " + t)
    };
    i.parseXML = function (t) {
        var r, u;
        if (!t || "string" != typeof t) return null;
        try {
            n.DOMParser ? (u = new DOMParser, r = u.parseFromString(t, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(t))
        } catch (f) {
            r = void 0
        }
        return r && r.documentElement && !r.getElementsByTagName("parsererror").length || i.error("Invalid XML: " + t), r
    };
    var nt, y, so = /#.*$/, sf = /([?&])_=[^&]*/, ho = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, co = /^(?:GET|HEAD)$/,
        lo = /^\/\//, hf = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, cf = {}, bi = {},
        lf = "*/".concat("*");
    try {
        y = location.href
    } catch (ns) {
        y = u.createElement("a");
        y.href = "";
        y = y.href
    }
    nt = hf.exec(y.toLowerCase()) || [];
    i.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: y,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(nt[1]),
            global: !0,
            processData: !0,
            "async": !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": lf,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: { xml: /xml/, html: /html/, json: /json/ },
            responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" },
            converters: { "* text": String, "text html": !0, "text json": i.parseJSON, "text xml": i.parseXML },
            flatOptions: { url: !0, context: !0 }
        },
        ajaxSetup: function (n, t) {
            return t ? ki(ki(n, i.ajaxSettings), t) : ki(i.ajaxSettings, n)
        },
        ajaxPrefilter: af(cf),
        ajaxTransport: af(bi),
        ajax: function (n, t) {
            function w(n, t, s, h) {
                var v, it, nt, y, w, c = t;
                2 !== e && (e = 2, k && clearTimeout(k), a = void 0, b = h || "", u.readyState = n > 0 ? 4 : 0, v = n >= 200 && 300 > n || 304 === n, s && (y = ao(r, u, s)), y = vo(r, y, u, v), v ? (r.ifModified && (w = u.getResponseHeader("Last-Modified"), w && (i.lastModified[f] = w), w = u.getResponseHeader("etag"), w && (i.etag[f] = w)), 204 === n || "HEAD" === r.type ? c = "nocontent" : 304 === n ? c = "notmodified" : (c = y.state, it = y.data, nt = y.error, v = !nt)) : (nt = c, (n || !c) && (c = "error", 0 > n && (n = 0))), u.status = n, u.statusText = (t || c) + "", v ? g.resolveWith(o, [it, c, u]) : g.rejectWith(o, [u, c, nt]), u.statusCode(p), p = void 0, l && d.trigger(v ? "ajaxSuccess" : "ajaxError", [u, r, v ? it : nt]), tt.fireWith(o, [u, c]), l && (d.trigger("ajaxComplete", [u, r]), --i.active || i.event.trigger("ajaxStop")))
            }

            "object" == typeof n && (t = n, n = void 0);
            t = t || {};
            var s, c, f, b, k, l, a, v, r = i.ajaxSetup({}, t), o = r.context || r,
                d = r.context && (o.nodeType || o.jquery) ? i(o) : i.event, g = i.Deferred(),
                tt = i.Callbacks("once memory"), p = r.statusCode || {}, it = {}, rt = {}, e = 0, ut = "canceled", u = {
                    readyState: 0, getResponseHeader: function (n) {
                        var t;
                        if (2 === e) {
                            if (!v) for (v = {}; t = ho.exec(b);) v[t[1].toLowerCase()] = t[2];
                            t = v[n.toLowerCase()]
                        }
                        return null == t ? null : t
                    }, getAllResponseHeaders: function () {
                        return 2 === e ? b : null
                    }, setRequestHeader: function (n, t) {
                        var i = n.toLowerCase();
                        return e || (n = rt[i] = rt[i] || n, it[n] = t), this
                    }, overrideMimeType: function (n) {
                        return e || (r.mimeType = n), this
                    }, statusCode: function (n) {
                        var t;
                        if (n) if (2 > e) for (t in n) p[t] = [p[t], n[t]]; else u.always(n[u.status]);
                        return this
                    }, abort: function (n) {
                        var t = n || ut;
                        return a && a.abort(t), w(0, t), this
                    }
                };
            if (g.promise(u).complete = tt.add, u.success = u.done, u.error = u.fail, r.url = ((n || r.url || y) + "").replace(so, "").replace(lo, nt[1] + "//"), r.type = t.method || t.type || r.method || r.type, r.dataTypes = i.trim(r.dataType || "*").toLowerCase().match(h) || [""], null == r.crossDomain && (s = hf.exec(r.url.toLowerCase()), r.crossDomain = !(!s || s[1] === nt[1] && s[2] === nt[2] && (s[3] || ("http:" === s[1] ? "80" : "443")) === (nt[3] || ("http:" === nt[1] ? "80" : "443")))), r.data && r.processData && "string" != typeof r.data && (r.data = i.param(r.data, r.traditional)), vf(cf, r, t, u), 2 === e) return u;
            l = r.global;
            l && 0 == i.active++ && i.event.trigger("ajaxStart");
            r.type = r.type.toUpperCase();
            r.hasContent = !co.test(r.type);
            f = r.url;
            r.hasContent || (r.data && (f = r.url += (wi.test(f) ? "&" : "?") + r.data, delete r.data), r.cache === !1 && (r.url = sf.test(f) ? f.replace(sf, "$1_=" + pi++) : f + (wi.test(f) ? "&" : "?") + "_=" + pi++));
            r.ifModified && (i.lastModified[f] && u.setRequestHeader("If-Modified-Since", i.lastModified[f]), i.etag[f] && u.setRequestHeader("If-None-Match", i.etag[f]));
            (r.data && r.hasContent && r.contentType !== !1 || t.contentType) && u.setRequestHeader("Content-Type", r.contentType);
            u.setRequestHeader("Accept", r.dataTypes[0] && r.accepts[r.dataTypes[0]] ? r.accepts[r.dataTypes[0]] + ("*" !== r.dataTypes[0] ? ", " + lf + "; q=0.01" : "") : r.accepts["*"]);
            for (c in r.headers) u.setRequestHeader(c, r.headers[c]);
            if (r.beforeSend && (r.beforeSend.call(o, u, r) === !1 || 2 === e)) return u.abort();
            ut = "abort";
            for (c in { success: 1, error: 1, complete: 1 }) u[c](r[c]);
            if (a = vf(bi, r, t, u)) {
                u.readyState = 1;
                l && d.trigger("ajaxSend", [u, r]);
                r.async && r.timeout > 0 && (k = setTimeout(function () {
                    u.abort("timeout")
                }, r.timeout));
                try {
                    e = 1;
                    a.send(it, w)
                } catch (ft) {
                    if (!(2 > e)) throw ft;
                    w(-1, ft)
                }
            } else w(-1, "No Transport");
            return u
        },
        getJSON: function (n, t, r) {
            return i.get(n, t, r, "json")
        },
        getScript: function (n, t) {
            return i.get(n, void 0, t, "script")
        }
    });
    i.each(["get", "post"], function (n, t) {
        i[t] = function (n, r, u, f) {
            return i.isFunction(r) && (f = f || u, u = r, r = void 0), i.ajax({
                url: n,
                type: t,
                dataType: f,
                data: r,
                success: u
            })
        }
    });
    i.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (n, t) {
        i.fn[t] = function (n) {
            return this.on(t, n)
        }
    });
    i._evalUrl = function (n) {
        return i.ajax({ url: n, type: "GET", dataType: "script", "async": !1, global: !1, throws: !0 })
    };
    i.fn.extend({
        wrapAll: function (n) {
            if (i.isFunction(n)) return this.each(function (t) {
                i(this).wrapAll(n.call(this, t))
            });
            if (this[0]) {
                var t = i(n, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]);
                t.map(function () {
                    for (var n = this; n.firstChild && 1 === n.firstChild.nodeType;) n = n.firstChild;
                    return n
                }).append(this)
            }
            return this
        }, wrapInner: function (n) {
            return this.each(i.isFunction(n) ? function (t) {
                i(this).wrapInner(n.call(this, t))
            } : function () {
                var t = i(this), r = t.contents();
                r.length ? r.wrapAll(n) : t.append(n)
            })
        }, wrap: function (n) {
            var t = i.isFunction(n);
            return this.each(function (r) {
                i(this).wrapAll(t ? n.call(this, r) : n)
            })
        }, unwrap: function () {
            return this.parent().each(function () {
                i.nodeName(this, "body") || i(this).replaceWith(this.childNodes)
            }).end()
        }
    });
    i.expr.filters.hidden = function (n) {
        return n.offsetWidth <= 0 && n.offsetHeight <= 0 || !r.reliableHiddenOffsets() && "none" === (n.style && n.style.display || i.css(n, "display"))
    };
    i.expr.filters.visible = function (n) {
        return !i.expr.filters.hidden(n)
    };
    var yo = /%20/g, po = /\[\]$/, yf = /\r?\n/g, wo = /^(?:submit|button|image|reset|file)$/i,
        bo = /^(?:input|select|textarea|keygen)/i;
    i.param = function (n, t) {
        var r, u = [], f = function (n, t) {
            t = i.isFunction(t) ? t() : null == t ? "" : t;
            u[u.length] = encodeURIComponent(n) + "=" + encodeURIComponent(t)
        };
        if (void 0 === t && (t = i.ajaxSettings && i.ajaxSettings.traditional), i.isArray(n) || n.jquery && !i.isPlainObject(n)) i.each(n, function () {
            f(this.name, this.value)
        }); else for (r in n) di(r, n[r], t, f);
        return u.join("&").replace(yo, "+")
    };
    i.fn.extend({
        serialize: function () {
            return i.param(this.serializeArray())
        }, serializeArray: function () {
            return this.map(function () {
                var n = i.prop(this, "elements");
                return n ? i.makeArray(n) : this
            }).filter(function () {
                var n = this.type;
                return this.name && !i(this).is(":disabled") && bo.test(this.nodeName) && !wo.test(n) && (this.checked || !oi.test(n))
            }).map(function (n, t) {
                var r = i(this).val();
                return null == r ? null : i.isArray(r) ? i.map(r, function (n) {
                    return { name: t.name, value: n.replace(yf, "\r\n") }
                }) : { name: t.name, value: r.replace(yf, "\r\n") }
            }).get()
        }
    });
    i.ajaxSettings.xhr = void 0 !== n.ActiveXObject ? function () {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && pf() || go()
    } : pf;
    var ko = 0, ni = {}, ht = i.ajaxSettings.xhr();
    return n.ActiveXObject && i(n).on("unload", function () {
        for (var n in ni) ni[n](void 0, !0)
    }), r.cors = !!ht && "withCredentials" in ht, ht = r.ajax = !!ht, ht && i.ajaxTransport(function (n) {
        if (!n.crossDomain || r.cors) {
            var t;
            return {
                send: function (r, u) {
                    var e, f = n.xhr(), o = ++ko;
                    if (f.open(n.type, n.url, n.async, n.username, n.password), n.xhrFields) for (e in n.xhrFields) f[e] = n.xhrFields[e];
                    n.mimeType && f.overrideMimeType && f.overrideMimeType(n.mimeType);
                    n.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest");
                    for (e in r) void 0 !== r[e] && f.setRequestHeader(e, r[e] + "");
                    f.send(n.hasContent && n.data || null);
                    t = function (r, e) {
                        var s, c, h;
                        if (t && (e || 4 === f.readyState)) if (delete ni[o], t = void 0, f.onreadystatechange = i.noop, e) 4 !== f.readyState && f.abort(); else {
                            h = {};
                            s = f.status;
                            "string" == typeof f.responseText && (h.text = f.responseText);
                            try {
                                c = f.statusText
                            } catch (l) {
                                c = ""
                            }
                            s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = h.text ? 200 : 404
                        }
                        h && u(s, c, h, f.getAllResponseHeaders())
                    };
                    n.async ? 4 === f.readyState ? setTimeout(t) : f.onreadystatechange = ni[o] = t : t()
                }, abort: function () {
                    t && t(void 0, !0)
                }
            }
        }
    }), i.ajaxSetup({
        accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" },
        contents: { script: /(?:java|ecma)script/ },
        converters: {
            "text script": function (n) {
                return i.globalEval(n), n
            }
        }
    }), i.ajaxPrefilter("script", function (n) {
        void 0 === n.cache && (n.cache = !1);
        n.crossDomain && (n.type = "GET", n.global = !1)
    }), i.ajaxTransport("script", function (n) {
        if (n.crossDomain) {
            var t, r = u.head || i("head")[0] || u.documentElement;
            return {
                send: function (i, f) {
                    t = u.createElement("script");
                    t.async = !0;
                    n.scriptCharset && (t.charset = n.scriptCharset);
                    t.src = n.url;
                    t.onload = t.onreadystatechange = function (n, i) {
                        (i || !t.readyState || /loaded|complete/.test(t.readyState)) && (t.onload = t.onreadystatechange = null, t.parentNode && t.parentNode.removeChild(t), t = null, i || f(200, "success"))
                    };
                    r.insertBefore(t, r.firstChild)
                }, abort: function () {
                    t && t.onload(void 0, !0)
                }
            }
        }
    }), gi = [], ti = /(=)\?(?=&|$)|\?\?/, i.ajaxSetup({
        jsonp: "callback", jsonpCallback: function () {
            var n = gi.pop() || i.expando + "_" + pi++;
            return this[n] = !0, n
        }
    }), i.ajaxPrefilter("json jsonp", function (t, r, u) {
        var f, o, e,
            s = t.jsonp !== !1 && (ti.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && ti.test(t.data) && "data");
        if (s || "jsonp" === t.dataTypes[0]) return (f = t.jsonpCallback = i.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace(ti, "$1" + f) : t.jsonp !== !1 && (t.url += (wi.test(t.url) ? "&" : "?") + t.jsonp + "=" + f), t.converters["script json"] = function () {
            return e || i.error(f + " was not called"), e[0]
        }, t.dataTypes[0] = "json", o = n[f], n[f] = function () {
            e = arguments
        }, u.always(function () {
            n[f] = o;
            t[f] && (t.jsonpCallback = r.jsonpCallback, gi.push(f));
            e && i.isFunction(o) && o(e[0]);
            e = o = void 0
        }), "script")
    }), i.parseHTML = function (n, t, r) {
        if (!n || "string" != typeof n) return null;
        "boolean" == typeof t && (r = t, t = !1);
        t = t || u;
        var f = er.exec(n), e = !r && [];
        return f ? [t.createElement(f[1])] : (f = i.buildFragment([n], t, e), e && e.length && i(e).remove(), i.merge([], f.childNodes))
    }, nr = i.fn.load, i.fn.load = function (n, t, r) {
        if ("string" != typeof n && nr) return nr.apply(this, arguments);
        var u, o, s, f = this, e = n.indexOf(" ");
        return e >= 0 && (u = i.trim(n.slice(e, n.length)), n = n.slice(0, e)), i.isFunction(t) ? (r = t, t = void 0) : t && "object" == typeof t && (s = "POST"), f.length > 0 && i.ajax({
            url: n,
            type: s,
            dataType: "html",
            data: t
        }).done(function (n) {
            o = arguments;
            f.html(u ? i("<div>").append(i.parseHTML(n)).find(u) : n)
        }).complete(r && function (n, t) {
            f.each(r, o || [n.responseText, t, n])
        }), this
    }, i.expr.filters.animated = function (n) {
        return i.grep(i.timers, function (t) {
            return n === t.elem
        }).length
    }, tr = n.document.documentElement, i.offset = {
        setOffset: function (n, t, r) {
            var e, o, s, h, u, c, v, l = i.css(n, "position"), a = i(n), f = {};
            "static" === l && (n.style.position = "relative");
            u = a.offset();
            s = i.css(n, "top");
            c = i.css(n, "left");
            v = ("absolute" === l || "fixed" === l) && i.inArray("auto", [s, c]) > -1;
            v ? (e = a.position(), h = e.top, o = e.left) : (h = parseFloat(s) || 0, o = parseFloat(c) || 0);
            i.isFunction(t) && (t = t.call(n, r, u));
            null != t.top && (f.top = t.top - u.top + h);
            null != t.left && (f.left = t.left - u.left + o);
            "using" in t ? t.using.call(n, f) : a.css(f)
        }
    }, i.fn.extend({
        offset: function (n) {
            if (arguments.length) return void 0 === n ? this : this.each(function (t) {
                i.offset.setOffset(this, n, t)
            });
            var t, f, u = { top: 0, left: 0 }, r = this[0], e = r && r.ownerDocument;
            if (e) return t = e.documentElement, i.contains(t, r) ? (typeof r.getBoundingClientRect !== o && (u = r.getBoundingClientRect()), f = wf(e), {
                top: u.top + (f.pageYOffset || t.scrollTop) - (t.clientTop || 0),
                left: u.left + (f.pageXOffset || t.scrollLeft) - (t.clientLeft || 0)
            }) : u
        }, position: function () {
            if (this[0]) {
                var n, r, t = { top: 0, left: 0 }, u = this[0];
                return "fixed" === i.css(u, "position") ? r = u.getBoundingClientRect() : (n = this.offsetParent(), r = this.offset(), i.nodeName(n[0], "html") || (t = n.offset()), t.top += i.css(n[0], "borderTopWidth", !0), t.left += i.css(n[0], "borderLeftWidth", !0)), {
                    top: r.top - t.top - i.css(u, "marginTop", !0),
                    left: r.left - t.left - i.css(u, "marginLeft", !0)
                }
            }
        }, offsetParent: function () {
            return this.map(function () {
                for (var n = this.offsetParent || tr; n && !i.nodeName(n, "html") && "static" === i.css(n, "position");) n = n.offsetParent;
                return n || tr
            })
        }
    }), i.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (n, t) {
        var r = /Y/.test(t);
        i.fn[n] = function (u) {
            return b(this, function (n, u, f) {
                var e = wf(n);
                return void 0 === f ? e ? t in e ? e[t] : e.document.documentElement[u] : n[u] : void (e ? e.scrollTo(r ? i(e).scrollLeft() : f, r ? f : i(e).scrollTop()) : n[u] = f)
            }, n, u, arguments.length, null)
        }
    }), i.each(["top", "left"], function (n, t) {
        i.cssHooks[t] = au(r.pixelPosition, function (n, r) {
            if (r) return (r = d(n, t), pt.test(r) ? i(n).position()[t] + "px" : r)
        })
    }), i.each({ Height: "height", Width: "width" }, function (n, t) {
        i.each({ padding: "inner" + n, content: t, "": "outer" + n }, function (r, u) {
            i.fn[u] = function (u, f) {
                var e = arguments.length && (r || "boolean" != typeof u),
                    o = r || (u === !0 || f === !0 ? "margin" : "border");
                return b(this, function (t, r, u) {
                    var f;
                    return i.isWindow(t) ? t.document.documentElement["client" + n] : 9 === t.nodeType ? (f = t.documentElement, Math.max(t.body["scroll" + n], f["scroll" + n], t.body["offset" + n], f["offset" + n], f["client" + n])) : void 0 === u ? i.css(t, r, o) : i.style(t, r, u, o)
                }, t, e ? u : void 0, e, null)
            }
        })
    }), i.fn.size = function () {
        return this.length
    }, i.fn.andSelf = i.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
        return i
    }), bf = n.jQuery, kf = n.$, i.noConflict = function (t) {
        return n.$ === i && (n.$ = kf), t && n.jQuery === i && (n.jQuery = bf), i
    }, typeof t === o && (n.jQuery = n.$ = i), i
});
/*! jQuery UI - v1.11.4 - 2015-03-11
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, accordion.js, autocomplete.js, button.js, datepicker.js, dialog.js, draggable.js, droppable.js, effect.js, effect-blind.js, effect-bounce.js, effect-clip.js, effect-drop.js, effect-explode.js, effect-fade.js, effect-fold.js, effect-highlight.js, effect-puff.js, effect-pulsate.js, effect-scale.js, effect-shake.js, effect-size.js, effect-slide.js, effect-transfer.js, menu.js, progressbar.js, resizable.js, selectable.js, selectmenu.js, slider.js, sortable.js, spinner.js, tabs.js, tooltip.js
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */
(function (n) {
    "function" == typeof define && define.amd ? define(["jquery"], n) : n(jQuery)
})(function (n) {
    function h(t, i) {
        var r, u, f, e = t.nodeName.toLowerCase();
        return "area" === e ? (r = t.parentNode, u = r.name, t.href && u && "map" === r.nodeName.toLowerCase() ? (f = n("img[usemap='#" + u + "']")[0], !!f && c(f)) : !1) : (/^(input|select|textarea|button|object)$/.test(e) ? !t.disabled : "a" === e ? t.href || i : i) && c(t)
    }

    function c(t) {
        return n.expr.filters.visible(t) && !n(t).parents().addBack().filter(function () {
            return "hidden" === n.css(this, "visibility")
        }).length
    }

    function k(n) {
        for (var t, i; n.length && n[0] !== document;) {
            if (t = n.css("position"), ("absolute" === t || "relative" === t || "fixed" === t) && (i = parseInt(n.css("zIndex"), 10), !isNaN(i) && 0 !== i)) return i;
            n = n.parent()
        }
        return 0
    }

    function l() {
        this._curInst = null;
        this._keyEvent = !1;
        this._disabledInputs = [];
        this._datepickerShowing = !1;
        this._inDialog = !1;
        this._mainDivId = "ui-datepicker-div";
        this._inlineClass = "ui-datepicker-inline";
        this._appendClass = "ui-datepicker-append";
        this._triggerClass = "ui-datepicker-trigger";
        this._dialogClass = "ui-datepicker-dialog";
        this._disableClass = "ui-datepicker-disabled";
        this._unselectableClass = "ui-datepicker-unselectable";
        this._currentClass = "ui-datepicker-current-day";
        this._dayOverClass = "ui-datepicker-days-cell-over";
        this.regional = [];
        this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: !1,
            showMonthAfterYear: !1,
            yearSuffix: ""
        };
        this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: !1,
            hideIfNoPrevNext: !1,
            navigationAsDateFormat: !1,
            gotoCurrent: !1,
            changeMonth: !1,
            changeYear: !1,
            yearRange: "c-10:c+10",
            showOtherMonths: !1,
            selectOtherMonths: !1,
            showWeek: !1,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: !0,
            showButtonPanel: !1,
            autoSize: !1,
            disabled: !1
        };
        n.extend(this._defaults, this.regional[""]);
        this.regional.en = n.extend(!0, {}, this.regional[""]);
        this.regional["en-US"] = n.extend(!0, {}, this.regional.en);
        this.dpDiv = a(n("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'><\/div>"))
    }

    function a(t) {
        var i = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return t.delegate(i, "mouseout", function () {
            n(this).removeClass("ui-state-hover");
            -1 !== this.className.indexOf("ui-datepicker-prev") && n(this).removeClass("ui-datepicker-prev-hover");
            -1 !== this.className.indexOf("ui-datepicker-next") && n(this).removeClass("ui-datepicker-next-hover")
        }).delegate(i, "mouseover", v)
    }

    function v() {
        n.datepicker._isDisabledDatepicker(i.inline ? i.dpDiv.parent()[0] : i.input[0]) || (n(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), n(this).addClass("ui-state-hover"), -1 !== this.className.indexOf("ui-datepicker-prev") && n(this).addClass("ui-datepicker-prev-hover"), -1 !== this.className.indexOf("ui-datepicker-next") && n(this).addClass("ui-datepicker-next-hover"))
    }

    function u(t, i) {
        n.extend(t, i);
        for (var r in i) null == i[r] && (t[r] = i[r]);
        return t
    }

    function t(n) {
        return function () {
            var t = this.element.val();
            n.apply(this, arguments);
            this._refresh();
            t !== this.element.val() && this._trigger("change")
        }
    }

    var y, f, r, i, o, s;
    n.ui = n.ui || {};
    n.extend(n.ui, {
        version: "1.11.4",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    });
    n.fn.extend({
        scrollParent: function (t) {
            var i = this.css("position"), u = "absolute" === i, f = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
                r = this.parents().filter(function () {
                    var t = n(this);
                    return u && "static" === t.css("position") ? !1 : f.test(t.css("overflow") + t.css("overflow-y") + t.css("overflow-x"))
                }).eq(0);
            return "fixed" !== i && r.length ? r : n(this[0].ownerDocument || document)
        }, uniqueId: function () {
            var n = 0;
            return function () {
                return this.each(function () {
                    this.id || (this.id = "ui-id-" + ++n)
                })
            }
        }(), removeUniqueId: function () {
            return this.each(function () {
                /^ui-id-\d+$/.test(this.id) && n(this).removeAttr("id")
            })
        }
    });
    n.extend(n.expr[":"], {
        data: n.expr.createPseudo ? n.expr.createPseudo(function (t) {
            return function (i) {
                return !!n.data(i, t)
            }
        }) : function (t, i, r) {
            return !!n.data(t, r[3])
        }, focusable: function (t) {
            return h(t, !isNaN(n.attr(t, "tabindex")))
        }, tabbable: function (t) {
            var i = n.attr(t, "tabindex"), r = isNaN(i);
            return (r || i >= 0) && h(t, !r)
        }
    });
    n("<a>").outerWidth(1).jquery || n.each(["Width", "Height"], function (t, i) {
        function r(t, i, r, u) {
            return n.each(e, function () {
                i -= parseFloat(n.css(t, "padding" + this)) || 0;
                r && (i -= parseFloat(n.css(t, "border" + this + "Width")) || 0);
                u && (i -= parseFloat(n.css(t, "margin" + this)) || 0)
            }), i
        }

        var e = "Width" === i ? ["Left", "Right"] : ["Top", "Bottom"], u = i.toLowerCase(), f = {
            innerWidth: n.fn.innerWidth,
            innerHeight: n.fn.innerHeight,
            outerWidth: n.fn.outerWidth,
            outerHeight: n.fn.outerHeight
        };
        n.fn["inner" + i] = function (t) {
            return void 0 === t ? f["inner" + i].call(this) : this.each(function () {
                n(this).css(u, r(this, t) + "px")
            })
        };
        n.fn["outer" + i] = function (t, e) {
            return "number" != typeof t ? f["outer" + i].call(this, t) : this.each(function () {
                n(this).css(u, r(this, t, !0, e) + "px")
            })
        }
    });
    n.fn.addBack || (n.fn.addBack = function (n) {
        return this.add(null == n ? this.prevObject : this.prevObject.filter(n))
    });
    n("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (n.fn.removeData = function (t) {
        return function (i) {
            return arguments.length ? t.call(this, n.camelCase(i)) : t.call(this)
        }
    }(n.fn.removeData));
    n.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
    n.fn.extend({
        focus: function (t) {
            return function (i, r) {
                return "number" == typeof i ? this.each(function () {
                    var t = this;
                    setTimeout(function () {
                        n(t).focus();
                        r && r.call(t)
                    }, i)
                }) : t.apply(this, arguments)
            }
        }(n.fn.focus), disableSelection: function () {
            var n = "onselectstart" in document.createElement("div") ? "selectstart" : "mousedown";
            return function () {
                return this.bind(n + ".ui-disableSelection", function (n) {
                    n.preventDefault()
                })
            }
        }(), enableSelection: function () {
            return this.unbind(".ui-disableSelection")
        }, zIndex: function (t) {
            if (void 0 !== t) return this.css("zIndex", t);
            if (this.length) for (var r, u, i = n(this[0]); i.length && i[0] !== document;) {
                if (r = i.css("position"), ("absolute" === r || "relative" === r || "fixed" === r) && (u = parseInt(i.css("zIndex"), 10), !isNaN(u) && 0 !== u)) return u;
                i = i.parent()
            }
            return 0
        }
    });
    n.ui.plugin = {
        add: function (t, i, r) {
            var u, f = n.ui[t].prototype;
            for (u in r) f.plugins[u] = f.plugins[u] || [], f.plugins[u].push([i, r[u]])
        }, call: function (n, t, i, r) {
            var u, f = n.plugins[t];
            if (f && (r || n.element[0].parentNode && 11 !== n.element[0].parentNode.nodeType)) for (u = 0; f.length > u; u++) n.options[f[u][0]] && f[u][1].apply(n.element, i)
        }
    };
    y = 0;
    f = Array.prototype.slice;
    n.cleanData = function (t) {
        return function (i) {
            for (var r, u, f = 0; null != (u = i[f]); f++) try {
                r = n._data(u, "events");
                r && r.remove && n(u).triggerHandler("remove")
            } catch (e) {
            }
            t(i)
        }
    }(n.cleanData);
    n.widget = function (t, i, r) {
        var s, f, u, o, h = {}, e = t.split(".")[0];
        return t = t.split(".")[1], s = e + "-" + t, r || (r = i, i = n.Widget), n.expr[":"][s.toLowerCase()] = function (t) {
            return !!n.data(t, s)
        }, n[e] = n[e] || {}, f = n[e][t], u = n[e][t] = function (n, t) {
            return this._createWidget ? (arguments.length && this._createWidget(n, t), void 0) : new u(n, t)
        }, n.extend(u, f, {
            version: r.version,
            _proto: n.extend({}, r),
            _childConstructors: []
        }), o = new i, o.options = n.widget.extend({}, o.options), n.each(r, function (t, r) {
            return n.isFunction(r) ? (h[t] = function () {
                var n = function () {
                    return i.prototype[t].apply(this, arguments)
                }, u = function (n) {
                    return i.prototype[t].apply(this, n)
                };
                return function () {
                    var t, i = this._super, f = this._superApply;
                    return this._super = n, this._superApply = u, t = r.apply(this, arguments), this._super = i, this._superApply = f, t
                }
            }(), void 0) : (h[t] = r, void 0)
        }), u.prototype = n.widget.extend(o, { widgetEventPrefix: f ? o.widgetEventPrefix || t : t }, h, {
            constructor: u,
            namespace: e,
            widgetName: t,
            widgetFullName: s
        }), f ? (n.each(f._childConstructors, function (t, i) {
            var r = i.prototype;
            n.widget(r.namespace + "." + r.widgetName, u, i._proto)
        }), delete f._childConstructors) : i._childConstructors.push(u), n.widget.bridge(t, u), u
    };
    n.widget.extend = function (t) {
        for (var i, r, e = f.call(arguments, 1), u = 0, o = e.length; o > u; u++) for (i in e[u]) r = e[u][i], e[u].hasOwnProperty(i) && void 0 !== r && (t[i] = n.isPlainObject(r) ? n.isPlainObject(t[i]) ? n.widget.extend({}, t[i], r) : n.widget.extend({}, r) : r);
        return t
    };
    n.widget.bridge = function (t, i) {
        var r = i.prototype.widgetFullName || t;
        n.fn[t] = function (u) {
            var s = "string" == typeof u, o = f.call(arguments, 1), e = this;
            return s ? this.each(function () {
                var i, f = n.data(this, r);
                return "instance" === u ? (e = f, !1) : f ? n.isFunction(f[u]) && "_" !== u.charAt(0) ? (i = f[u].apply(f, o), i !== f && void 0 !== i ? (e = i && i.jquery ? e.pushStack(i.get()) : i, !1) : void 0) : n.error("no such method '" + u + "' for " + t + " widget instance") : n.error("cannot call methods on " + t + " prior to initialization; attempted to call method '" + u + "'")
            }) : (o.length && (u = n.widget.extend.apply(null, [u].concat(o))), this.each(function () {
                var t = n.data(this, r);
                t ? (t.option(u || {}), t._init && t._init()) : n.data(this, r, new i(u, this))
            })), e
        }
    };
    n.Widget = function () {
    };
    n.Widget._childConstructors = [];
    n.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",
        options: { disabled: !1, create: null },
        _createWidget: function (t, i) {
            i = n(i || this.defaultElement || this)[0];
            this.element = n(i);
            this.uuid = y++;
            this.eventNamespace = "." + this.widgetName + this.uuid;
            this.bindings = n();
            this.hoverable = n();
            this.focusable = n();
            i !== this && (n.data(i, this.widgetFullName, this), this._on(!0, this.element, {
                remove: function (n) {
                    n.target === i && this.destroy()
                }
            }), this.document = n(i.style ? i.ownerDocument : i.document || i), this.window = n(this.document[0].defaultView || this.document[0].parentWindow));
            this.options = n.widget.extend({}, this.options, this._getCreateOptions(), t);
            this._create();
            this._trigger("create", null, this._getCreateEventData());
            this._init()
        },
        _getCreateOptions: n.noop,
        _getCreateEventData: n.noop,
        _create: n.noop,
        _init: n.noop,
        destroy: function () {
            this._destroy();
            this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(n.camelCase(this.widgetFullName));
            this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled ui-state-disabled");
            this.bindings.unbind(this.eventNamespace);
            this.hoverable.removeClass("ui-state-hover");
            this.focusable.removeClass("ui-state-focus")
        },
        _destroy: n.noop,
        widget: function () {
            return this.element
        },
        option: function (t, i) {
            var r, u, f, e = t;
            if (0 === arguments.length) return n.widget.extend({}, this.options);
            if ("string" == typeof t) if (e = {}, r = t.split("."), t = r.shift(), r.length) {
                for (u = e[t] = n.widget.extend({}, this.options[t]), f = 0; r.length - 1 > f; f++) u[r[f]] = u[r[f]] || {}, u = u[r[f]];
                if (t = r.pop(), 1 === arguments.length) return void 0 === u[t] ? null : u[t];
                u[t] = i
            } else {
                if (1 === arguments.length) return void 0 === this.options[t] ? null : this.options[t];
                e[t] = i
            }
            return this._setOptions(e), this
        },
        _setOptions: function (n) {
            for (var t in n) this._setOption(t, n[t]);
            return this
        },
        _setOption: function (n, t) {
            return this.options[n] = t, "disabled" === n && (this.widget().toggleClass(this.widgetFullName + "-disabled", !!t), t && (this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus"))), this
        },
        enable: function () {
            return this._setOptions({ disabled: !1 })
        },
        disable: function () {
            return this._setOptions({ disabled: !0 })
        },
        _on: function (t, i, r) {
            var f, u = this;
            "boolean" != typeof t && (r = i, i = t, t = !1);
            r ? (i = f = n(i), this.bindings = this.bindings.add(i)) : (r = i, i = this.element, f = this.widget());
            n.each(r, function (r, e) {
                function o() {
                    if (t || u.options.disabled !== !0 && !n(this).hasClass("ui-state-disabled")) return ("string" == typeof e ? u[e] : e).apply(u, arguments)
                }

                "string" != typeof e && (o.guid = e.guid = e.guid || o.guid || n.guid++);
                var s = r.match(/^([\w:-]*)\s*(.*)$/), h = s[1] + u.eventNamespace, c = s[2];
                c ? f.delegate(c, h, o) : i.bind(h, o)
            })
        },
        _off: function (t, i) {
            i = (i || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
            t.unbind(i).undelegate(i);
            this.bindings = n(this.bindings.not(t).get());
            this.focusable = n(this.focusable.not(t).get());
            this.hoverable = n(this.hoverable.not(t).get())
        },
        _delay: function (n, t) {
            function r() {
                return ("string" == typeof n ? i[n] : n).apply(i, arguments)
            }

            var i = this;
            return setTimeout(r, t || 0)
        },
        _hoverable: function (t) {
            this.hoverable = this.hoverable.add(t);
            this._on(t, {
                mouseenter: function (t) {
                    n(t.currentTarget).addClass("ui-state-hover")
                }, mouseleave: function (t) {
                    n(t.currentTarget).removeClass("ui-state-hover")
                }
            })
        },
        _focusable: function (t) {
            this.focusable = this.focusable.add(t);
            this._on(t, {
                focusin: function (t) {
                    n(t.currentTarget).addClass("ui-state-focus")
                }, focusout: function (t) {
                    n(t.currentTarget).removeClass("ui-state-focus")
                }
            })
        },
        _trigger: function (t, i, r) {
            var u, f, e = this.options[t];
            if (r = r || {}, i = n.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], f = i.originalEvent) for (u in f) u in i || (i[u] = f[u]);
            return this.element.trigger(i, r), !(n.isFunction(e) && e.apply(this.element[0], [i].concat(r)) === !1 || i.isDefaultPrevented())
        }
    };
    n.each({ show: "fadeIn", hide: "fadeOut" }, function (t, i) {
        n.Widget.prototype["_" + t] = function (r, u, f) {
            "string" == typeof u && (u = { effect: u });
            var o, e = u ? u === !0 || "number" == typeof u ? i : u.effect || i : t;
            u = u || {};
            "number" == typeof u && (u = { duration: u });
            o = !n.isEmptyObject(u);
            u.complete = f;
            u.delay && r.delay(u.delay);
            o && n.effects && n.effects.effect[e] ? r[t](u) : e !== t && r[e] ? r[e](u.duration, u.easing, f) : r.queue(function (i) {
                n(this)[t]();
                f && f.call(r[0]);
                i()
            })
        }
    });
    n.widget;
    r = !1;
    n(document).mouseup(function () {
        r = !1
    });
    n.widget("ui.mouse", {
        version: "1.11.4",
        options: { cancel: "input,textarea,button,select,option", distance: 1, delay: 0 },
        _mouseInit: function () {
            var t = this;
            this.element.bind("mousedown." + this.widgetName, function (n) {
                return t._mouseDown(n)
            }).bind("click." + this.widgetName, function (i) {
                if (!0 === n.data(i.target, t.widgetName + ".preventClickEvent")) return (n.removeData(i.target, t.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1)
            });
            this.started = !1
        },
        _mouseDestroy: function () {
            this.element.unbind("." + this.widgetName);
            this._mouseMoveDelegate && this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function (t) {
            if (!r) {
                this._mouseMoved = !1;
                this._mouseStarted && this._mouseUp(t);
                this._mouseDownEvent = t;
                var i = this, u = 1 === t.which,
                    f = "string" == typeof this.options.cancel && t.target.nodeName ? n(t.target).closest(this.options.cancel).length : !1;
                return u && !f && this._mouseCapture(t) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                    i.mouseDelayMet = !0
                }, this.options.delay)), this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(t) !== !1, !this._mouseStarted) ? (t.preventDefault(), !0) : (!0 === n.data(t.target, this.widgetName + ".preventClickEvent") && n.removeData(t.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (n) {
                    return i._mouseMove(n)
                }, this._mouseUpDelegate = function (n) {
                    return i._mouseUp(n)
                }, this.document.bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), t.preventDefault(), r = !0, !0)) : !0
            }
        },
        _mouseMove: function (t) {
            return this._mouseMoved && (n.ui.ie && (!document.documentMode || 9 > document.documentMode) && !t.button || !t.which) ? this._mouseUp(t) : ((t.which || t.button) && (this._mouseMoved = !0), this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted))
        },
        _mouseUp: function (t) {
            return this.document.unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && n.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), r = !1, !1
        },
        _mouseDistanceMet: function (n) {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - n.pageX), Math.abs(this._mouseDownEvent.pageY - n.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function () {
            return this.mouseDelayMet
        },
        _mouseStart: function () {
        },
        _mouseDrag: function () {
        },
        _mouseStop: function () {
        },
        _mouseCapture: function () {
            return !0
        }
    }), function () {
        function f(n, t, i) {
            return [parseFloat(n[0]) * (a.test(n[0]) ? t / 100 : 1), parseFloat(n[1]) * (a.test(n[1]) ? i / 100 : 1)]
        }

        function i(t, i) {
            return parseInt(n.css(t, i), 10) || 0
        }

        function v(t) {
            var i = t[0];
            return 9 === i.nodeType ? {
                width: t.width(),
                height: t.height(),
                offset: { top: 0, left: 0 }
            } : n.isWindow(i) ? {
                width: t.width(),
                height: t.height(),
                offset: { top: t.scrollTop(), left: t.scrollLeft() }
            } : i.preventDefault ? {
                width: 0,
                height: 0,
                offset: { top: i.pageY, left: i.pageX }
            } : { width: t.outerWidth(), height: t.outerHeight(), offset: t.offset() }
        }

        n.ui = n.ui || {};
        var u, e, r = Math.max, t = Math.abs, o = Math.round, s = /left|center|right/, h = /top|center|bottom/,
            c = /[\+\-]\d+(\.[\d]+)?%?/, l = /^\w+/, a = /%$/, y = n.fn.position;
        n.position = {
            scrollbarWidth: function () {
                if (void 0 !== u) return u;
                var r, i,
                    t = n("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'><\/div><\/div>"),
                    f = t.children()[0];
                return n("body").append(t), r = f.offsetWidth, t.css("overflow", "scroll"), i = f.offsetWidth, r === i && (i = t[0].clientWidth), t.remove(), u = r - i
            }, getScrollInfo: function (t) {
                var i = t.isWindow || t.isDocument ? "" : t.element.css("overflow-x"),
                    r = t.isWindow || t.isDocument ? "" : t.element.css("overflow-y"),
                    u = "scroll" === i || "auto" === i && t.width < t.element[0].scrollWidth,
                    f = "scroll" === r || "auto" === r && t.height < t.element[0].scrollHeight;
                return { width: f ? n.position.scrollbarWidth() : 0, height: u ? n.position.scrollbarWidth() : 0 }
            }, getWithinInfo: function (t) {
                var i = n(t || window), r = n.isWindow(i[0]), u = !!i[0] && 9 === i[0].nodeType;
                return {
                    element: i,
                    isWindow: r,
                    isDocument: u,
                    offset: i.offset() || { left: 0, top: 0 },
                    scrollLeft: i.scrollLeft(),
                    scrollTop: i.scrollTop(),
                    width: r || u ? i.width() : i.outerWidth(),
                    height: r || u ? i.height() : i.outerHeight()
                }
            }
        };
        n.fn.position = function (u) {
            if (!u || !u.of) return y.apply(this, arguments);
            u = n.extend({}, u);
            var k, a, p, b, w, g, nt = n(u.of), it = n.position.getWithinInfo(u.within),
                rt = n.position.getScrollInfo(it), d = (u.collision || "flip").split(" "), tt = {};
            return g = v(nt), nt[0].preventDefault && (u.at = "left top"), a = g.width, p = g.height, b = g.offset, w = n.extend({}, b), n.each(["my", "at"], function () {
                var t, i, n = (u[this] || "").split(" ");
                1 === n.length && (n = s.test(n[0]) ? n.concat(["center"]) : h.test(n[0]) ? ["center"].concat(n) : ["center", "center"]);
                n[0] = s.test(n[0]) ? n[0] : "center";
                n[1] = h.test(n[1]) ? n[1] : "center";
                t = c.exec(n[0]);
                i = c.exec(n[1]);
                tt[this] = [t ? t[0] : 0, i ? i[0] : 0];
                u[this] = [l.exec(n[0])[0], l.exec(n[1])[0]]
            }), 1 === d.length && (d[1] = d[0]), "right" === u.at[0] ? w.left += a : "center" === u.at[0] && (w.left += a / 2), "bottom" === u.at[1] ? w.top += p : "center" === u.at[1] && (w.top += p / 2), k = f(tt.at, a, p), w.left += k[0], w.top += k[1], this.each(function () {
                var y, g, h = n(this), c = h.outerWidth(), l = h.outerHeight(), ut = i(this, "marginLeft"),
                    ft = i(this, "marginTop"), et = c + ut + i(this, "marginRight") + rt.width,
                    ot = l + ft + i(this, "marginBottom") + rt.height, s = n.extend({}, w),
                    v = f(tt.my, h.outerWidth(), h.outerHeight());
                "right" === u.my[0] ? s.left -= c : "center" === u.my[0] && (s.left -= c / 2);
                "bottom" === u.my[1] ? s.top -= l : "center" === u.my[1] && (s.top -= l / 2);
                s.left += v[0];
                s.top += v[1];
                e || (s.left = o(s.left), s.top = o(s.top));
                y = { marginLeft: ut, marginTop: ft };
                n.each(["left", "top"], function (t, i) {
                    n.ui.position[d[t]] && n.ui.position[d[t]][i](s, {
                        targetWidth: a,
                        targetHeight: p,
                        elemWidth: c,
                        elemHeight: l,
                        collisionPosition: y,
                        collisionWidth: et,
                        collisionHeight: ot,
                        offset: [k[0] + v[0], k[1] + v[1]],
                        my: u.my,
                        at: u.at,
                        within: it,
                        elem: h
                    })
                });
                u.using && (g = function (n) {
                    var i = b.left - s.left, o = i + a - c, f = b.top - s.top, v = f + p - l, e = {
                        target: { element: nt, left: b.left, top: b.top, width: a, height: p },
                        element: { element: h, left: s.left, top: s.top, width: c, height: l },
                        horizontal: 0 > o ? "left" : i > 0 ? "right" : "center",
                        vertical: 0 > v ? "top" : f > 0 ? "bottom" : "middle"
                    };
                    c > a && a > t(i + o) && (e.horizontal = "center");
                    l > p && p > t(f + v) && (e.vertical = "middle");
                    e.important = r(t(i), t(o)) > r(t(f), t(v)) ? "horizontal" : "vertical";
                    u.using.call(this, n, e)
                });
                h.offset(n.extend(s, { using: g }))
            })
        };
        n.ui.position = {
            fit: {
                left: function (n, t) {
                    var h, e = t.within, u = e.isWindow ? e.scrollLeft : e.offset.left, o = e.width,
                        s = n.left - t.collisionPosition.marginLeft, i = u - s, f = s + t.collisionWidth - o - u;
                    t.collisionWidth > o ? i > 0 && 0 >= f ? (h = n.left + i + t.collisionWidth - o - u, n.left += i - h) : n.left = f > 0 && 0 >= i ? u : i > f ? u + o - t.collisionWidth : u : i > 0 ? n.left += i : f > 0 ? n.left -= f : n.left = r(n.left - s, n.left)
                }, top: function (n, t) {
                    var h, o = t.within, u = o.isWindow ? o.scrollTop : o.offset.top, e = t.within.height,
                        s = n.top - t.collisionPosition.marginTop, i = u - s, f = s + t.collisionHeight - e - u;
                    t.collisionHeight > e ? i > 0 && 0 >= f ? (h = n.top + i + t.collisionHeight - e - u, n.top += i - h) : n.top = f > 0 && 0 >= i ? u : i > f ? u + e - t.collisionHeight : u : i > 0 ? n.top += i : f > 0 ? n.top -= f : n.top = r(n.top - s, n.top)
                }
            }, flip: {
                left: function (n, i) {
                    var o, s, r = i.within, y = r.offset.left + r.scrollLeft, c = r.width,
                        h = r.isWindow ? r.scrollLeft : r.offset.left, l = n.left - i.collisionPosition.marginLeft,
                        a = l - h, v = l + i.collisionWidth - c - h,
                        u = "left" === i.my[0] ? -i.elemWidth : "right" === i.my[0] ? i.elemWidth : 0,
                        f = "left" === i.at[0] ? i.targetWidth : "right" === i.at[0] ? -i.targetWidth : 0,
                        e = -2 * i.offset[0];
                    0 > a ? (o = n.left + u + f + e + i.collisionWidth - c - y, (0 > o || t(a) > o) && (n.left += u + f + e)) : v > 0 && (s = n.left - i.collisionPosition.marginLeft + u + f + e - h, (s > 0 || v > t(s)) && (n.left += u + f + e))
                }, top: function (n, i) {
                    var o, s, r = i.within, y = r.offset.top + r.scrollTop, c = r.height,
                        h = r.isWindow ? r.scrollTop : r.offset.top, l = n.top - i.collisionPosition.marginTop,
                        a = l - h, v = l + i.collisionHeight - c - h, p = "top" === i.my[1],
                        u = p ? -i.elemHeight : "bottom" === i.my[1] ? i.elemHeight : 0,
                        f = "top" === i.at[1] ? i.targetHeight : "bottom" === i.at[1] ? -i.targetHeight : 0,
                        e = -2 * i.offset[1];
                    0 > a ? (s = n.top + u + f + e + i.collisionHeight - c - y, (0 > s || t(a) > s) && (n.top += u + f + e)) : v > 0 && (o = n.top - i.collisionPosition.marginTop + u + f + e - h, (o > 0 || v > t(o)) && (n.top += u + f + e))
                }
            }, flipfit: {
                left: function () {
                    n.ui.position.flip.left.apply(this, arguments);
                    n.ui.position.fit.left.apply(this, arguments)
                }, top: function () {
                    n.ui.position.flip.top.apply(this, arguments);
                    n.ui.position.fit.top.apply(this, arguments)
                }
            }
        }, function () {
            var t, i, r, u, f, o = document.getElementsByTagName("body")[0], s = document.createElement("div");
            t = document.createElement(o ? "div" : "body");
            r = { visibility: "hidden", width: 0, height: 0, border: 0, margin: 0, background: "none" };
            o && n.extend(r, { position: "absolute", left: "-1000px", top: "-1000px" });
            for (f in r) t.style[f] = r[f];
            t.appendChild(s);
            i = o || document.documentElement;
            i.insertBefore(t, i.firstChild);
            s.style.cssText = "position: absolute; left: 10.7432222px;";
            u = n(s).offset().left;
            e = u > 10 && 11 > u;
            t.innerHTML = "";
            i.removeChild(t)
        }()
    }();
    n.ui.position;
    n.widget("ui.accordion", {
        version: "1.11.4",
        options: {
            active: 0,
            animate: {},
            collapsible: !1,
            event: "click",
            header: "> li > :first-child,> :not(li):even",
            heightStyle: "auto",
            icons: { activeHeader: "ui-icon-triangle-1-s", header: "ui-icon-triangle-1-e" },
            activate: null,
            beforeActivate: null
        },
        hideProps: {
            borderTopWidth: "hide",
            borderBottomWidth: "hide",
            paddingTop: "hide",
            paddingBottom: "hide",
            height: "hide"
        },
        showProps: {
            borderTopWidth: "show",
            borderBottomWidth: "show",
            paddingTop: "show",
            paddingBottom: "show",
            height: "show"
        },
        _create: function () {
            var t = this.options;
            this.prevShow = this.prevHide = n();
            this.element.addClass("ui-accordion ui-widget ui-helper-reset").attr("role", "tablist");
            t.collapsible || t.active !== !1 && null != t.active || (t.active = 0);
            this._processPanels();
            0 > t.active && (t.active += this.headers.length);
            this._refresh()
        },
        _getCreateEventData: function () {
            return { header: this.active, panel: this.active.length ? this.active.next() : n() }
        },
        _createIcons: function () {
            var t = this.options.icons;
            t && (n("<span>").addClass("ui-accordion-header-icon ui-icon " + t.header).prependTo(this.headers), this.active.children(".ui-accordion-header-icon").removeClass(t.header).addClass(t.activeHeader), this.headers.addClass("ui-accordion-icons"))
        },
        _destroyIcons: function () {
            this.headers.removeClass("ui-accordion-icons").children(".ui-accordion-header-icon").remove()
        },
        _destroy: function () {
            var n;
            this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role");
            this.headers.removeClass("ui-accordion-header ui-accordion-header-active ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("aria-controls").removeAttr("tabIndex").removeUniqueId();
            this._destroyIcons();
            n = this.headers.next().removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-state-disabled").css("display", "").removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeUniqueId();
            "content" !== this.options.heightStyle && n.css("height", "")
        },
        _setOption: function (n, t) {
            return "active" === n ? (this._activate(t), void 0) : ("event" === n && (this.options.event && this._off(this.headers, this.options.event), this._setupEvents(t)), this._super(n, t), "collapsible" !== n || t || this.options.active !== !1 || this._activate(0), "icons" === n && (this._destroyIcons(), t && this._createIcons()), "disabled" === n && (this.element.toggleClass("ui-state-disabled", !!t).attr("aria-disabled", t), this.headers.add(this.headers.next()).toggleClass("ui-state-disabled", !!t)), void 0)
        },
        _keydown: function (t) {
            if (!t.altKey && !t.ctrlKey) {
                var i = n.ui.keyCode, u = this.headers.length, f = this.headers.index(t.target), r = !1;
                switch (t.keyCode) {
                    case i.RIGHT:
                    case i.DOWN:
                        r = this.headers[(f + 1) % u];
                        break;
                    case i.LEFT:
                    case i.UP:
                        r = this.headers[(f - 1 + u) % u];
                        break;
                    case i.SPACE:
                    case i.ENTER:
                        this._eventHandler(t);
                        break;
                    case i.HOME:
                        r = this.headers[0];
                        break;
                    case i.END:
                        r = this.headers[u - 1]
                }
                r && (n(t.target).attr("tabIndex", -1), n(r).attr("tabIndex", 0), r.focus(), t.preventDefault())
            }
        },
        _panelKeyDown: function (t) {
            t.keyCode === n.ui.keyCode.UP && t.ctrlKey && n(t.currentTarget).prev().focus()
        },
        refresh: function () {
            var t = this.options;
            this._processPanels();
            t.active === !1 && t.collapsible === !0 || !this.headers.length ? (t.active = !1, this.active = n()) : t.active === !1 ? this._activate(0) : this.active.length && !n.contains(this.element[0], this.active[0]) ? this.headers.length === this.headers.find(".ui-state-disabled").length ? (t.active = !1, this.active = n()) : this._activate(Math.max(0, t.active - 1)) : t.active = this.headers.index(this.active);
            this._destroyIcons();
            this._refresh()
        },
        _processPanels: function () {
            var t = this.headers, n = this.panels;
            this.headers = this.element.find(this.options.header).addClass("ui-accordion-header ui-state-default ui-corner-all");
            this.panels = this.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom").filter(":not(.ui-accordion-content-active)").hide();
            n && (this._off(t.not(this.headers)), this._off(n.not(this.panels)))
        },
        _refresh: function () {
            var t, i = this.options, r = i.heightStyle, u = this.element.parent();
            this.active = this._findActive(i.active).addClass("ui-accordion-header-active ui-state-active ui-corner-top").removeClass("ui-corner-all");
            this.active.next().addClass("ui-accordion-content-active").show();
            this.headers.attr("role", "tab").each(function () {
                var t = n(this), r = t.uniqueId().attr("id"), i = t.next(), u = i.uniqueId().attr("id");
                t.attr("aria-controls", u);
                i.attr("aria-labelledby", r)
            }).next().attr("role", "tabpanel");
            this.headers.not(this.active).attr({
                "aria-selected": "false",
                "aria-expanded": "false",
                tabIndex: -1
            }).next().attr({ "aria-hidden": "true" }).hide();
            this.active.length ? this.active.attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            }).next().attr({ "aria-hidden": "false" }) : this.headers.eq(0).attr("tabIndex", 0);
            this._createIcons();
            this._setupEvents(i.event);
            "fill" === r ? (t = u.height(), this.element.siblings(":visible").each(function () {
                var i = n(this), r = i.css("position");
                "absolute" !== r && "fixed" !== r && (t -= i.outerHeight(!0))
            }), this.headers.each(function () {
                t -= n(this).outerHeight(!0)
            }), this.headers.next().each(function () {
                n(this).height(Math.max(0, t - n(this).innerHeight() + n(this).height()))
            }).css("overflow", "auto")) : "auto" === r && (t = 0, this.headers.next().each(function () {
                t = Math.max(t, n(this).css("height", "").height())
            }).height(t))
        },
        _activate: function (t) {
            var i = this._findActive(t)[0];
            i !== this.active[0] && (i = i || this.active[0], this._eventHandler({
                target: i,
                currentTarget: i,
                preventDefault: n.noop
            }))
        },
        _findActive: function (t) {
            return "number" == typeof t ? this.headers.eq(t) : n()
        },
        _setupEvents: function (t) {
            var i = { keydown: "_keydown" };
            t && n.each(t.split(" "), function (n, t) {
                i[t] = "_eventHandler"
            });
            this._off(this.headers.add(this.headers.next()));
            this._on(this.headers, i);
            this._on(this.headers.next(), { keydown: "_panelKeyDown" });
            this._hoverable(this.headers);
            this._focusable(this.headers)
        },
        _eventHandler: function (t) {
            var i = this.options, u = this.active, r = n(t.currentTarget), f = r[0] === u[0], e = f && i.collapsible,
                s = e ? n() : r.next(), h = u.next(),
                o = { oldHeader: u, oldPanel: h, newHeader: e ? n() : r, newPanel: s };
            t.preventDefault();
            f && !i.collapsible || this._trigger("beforeActivate", t, o) === !1 || (i.active = e ? !1 : this.headers.index(r), this.active = f ? n() : r, this._toggle(o), u.removeClass("ui-accordion-header-active ui-state-active"), i.icons && u.children(".ui-accordion-header-icon").removeClass(i.icons.activeHeader).addClass(i.icons.header), f || (r.removeClass("ui-corner-all").addClass("ui-accordion-header-active ui-state-active ui-corner-top"), i.icons && r.children(".ui-accordion-header-icon").removeClass(i.icons.header).addClass(i.icons.activeHeader), r.next().addClass("ui-accordion-content-active")))
        },
        _toggle: function (t) {
            var r = t.newPanel, i = this.prevShow.length ? this.prevShow : t.oldPanel;
            this.prevShow.add(this.prevHide).stop(!0, !0);
            this.prevShow = r;
            this.prevHide = i;
            this.options.animate ? this._animate(r, i, t) : (i.hide(), r.show(), this._toggleComplete(t));
            i.attr({ "aria-hidden": "true" });
            i.prev().attr({ "aria-selected": "false", "aria-expanded": "false" });
            r.length && i.length ? i.prev().attr({
                tabIndex: -1,
                "aria-expanded": "false"
            }) : r.length && this.headers.filter(function () {
                return 0 === parseInt(n(this).attr("tabIndex"), 10)
            }).attr("tabIndex", -1);
            r.attr("aria-hidden", "false").prev().attr({ "aria-selected": "true", "aria-expanded": "true", tabIndex: 0 })
        },
        _animate: function (n, t, i) {
            var h, r, u, c = this, o = 0, l = n.css("box-sizing"), a = n.length && (!t.length || n.index() < t.index()),
                e = this.options.animate || {}, f = a && e.down || e, s = function () {
                    c._toggleComplete(i)
                };
            return "number" == typeof f && (u = f), "string" == typeof f && (r = f), r = r || f.easing || e.easing, u = u || f.duration || e.duration, t.length ? n.length ? (h = n.show().outerHeight(), t.animate(this.hideProps, {
                duration: u,
                easing: r,
                step: function (n, t) {
                    t.now = Math.round(n)
                }
            }), n.hide().animate(this.showProps, {
                duration: u, easing: r, complete: s, step: function (n, i) {
                    i.now = Math.round(n);
                    "height" !== i.prop ? "content-box" === l && (o += i.now) : "content" !== c.options.heightStyle && (i.now = Math.round(h - t.outerHeight() - o), o = 0)
                }
            }), void 0) : t.animate(this.hideProps, u, r, s) : n.animate(this.showProps, u, r, s)
        },
        _toggleComplete: function (n) {
            var t = n.oldPanel;
            t.removeClass("ui-accordion-content-active").prev().removeClass("ui-corner-top").addClass("ui-corner-all");
            t.length && (t.parent()[0].className = t.parent()[0].className);
            this._trigger("activate", null, n)
        }
    });
    n.widget("ui.menu", {
        version: "1.11.4",
        defaultElement: "<ul>",
        delay: 300,
        options: {
            icons: { submenu: "ui-icon-carat-1-e" },
            items: "> *",
            menus: "ul",
            position: { my: "left-1 top", at: "right top" },
            role: "menu",
            blur: null,
            focus: null,
            select: null
        },
        _create: function () {
            this.activeMenu = this.element;
            this.mouseHandled = !1;
            this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content").toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length).attr({
                role: this.options.role,
                tabIndex: 0
            });
            this.options.disabled && this.element.addClass("ui-state-disabled").attr("aria-disabled", "true");
            this._on({
                "mousedown .ui-menu-item": function (n) {
                    n.preventDefault()
                }, "click .ui-menu-item": function (t) {
                    var i = n(t.target);
                    !this.mouseHandled && i.not(".ui-state-disabled").length && (this.select(t), t.isPropagationStopped() || (this.mouseHandled = !0), i.has(".ui-menu").length ? this.expand(t) : !this.element.is(":focus") && n(this.document[0].activeElement).closest(".ui-menu").length && (this.element.trigger("focus", [!0]), this.active && 1 === this.active.parents(".ui-menu").length && clearTimeout(this.timer)))
                }, "mouseenter .ui-menu-item": function (t) {
                    if (!this.previousFilter) {
                        var i = n(t.currentTarget);
                        i.siblings(".ui-state-active").removeClass("ui-state-active");
                        this.focus(t, i)
                    }
                }, mouseleave: "collapseAll", "mouseleave .ui-menu": "collapseAll", focus: function (n, t) {
                    var i = this.active || this.element.find(this.options.items).eq(0);
                    t || this.focus(n, i)
                }, blur: function (t) {
                    this._delay(function () {
                        n.contains(this.element[0], this.document[0].activeElement) || this.collapseAll(t)
                    })
                }, keydown: "_keydown"
            });
            this.refresh();
            this._on(this.document, {
                click: function (n) {
                    this._closeOnDocumentClick(n) && this.collapseAll(n);
                    this.mouseHandled = !1
                }
            })
        },
        _destroy: function () {
            this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-menu-icons ui-front").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show();
            this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").removeUniqueId().removeClass("ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function () {
                var t = n(this);
                t.data("ui-menu-submenu-carat") && t.remove()
            });
            this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")
        },
        _keydown: function (t) {
            var i, u, r, f, e = !0;
            switch (t.keyCode) {
                case n.ui.keyCode.PAGE_UP:
                    this.previousPage(t);
                    break;
                case n.ui.keyCode.PAGE_DOWN:
                    this.nextPage(t);
                    break;
                case n.ui.keyCode.HOME:
                    this._move("first", "first", t);
                    break;
                case n.ui.keyCode.END:
                    this._move("last", "last", t);
                    break;
                case n.ui.keyCode.UP:
                    this.previous(t);
                    break;
                case n.ui.keyCode.DOWN:
                    this.next(t);
                    break;
                case n.ui.keyCode.LEFT:
                    this.collapse(t);
                    break;
                case n.ui.keyCode.RIGHT:
                    this.active && !this.active.is(".ui-state-disabled") && this.expand(t);
                    break;
                case n.ui.keyCode.ENTER:
                case n.ui.keyCode.SPACE:
                    this._activate(t);
                    break;
                case n.ui.keyCode.ESCAPE:
                    this.collapse(t);
                    break;
                default:
                    e = !1;
                    u = this.previousFilter || "";
                    r = String.fromCharCode(t.keyCode);
                    f = !1;
                    clearTimeout(this.filterTimer);
                    r === u ? f = !0 : r = u + r;
                    i = this._filterMenuItems(r);
                    i = f && -1 !== i.index(this.active.next()) ? this.active.nextAll(".ui-menu-item") : i;
                    i.length || (r = String.fromCharCode(t.keyCode), i = this._filterMenuItems(r));
                    i.length ? (this.focus(t, i), this.previousFilter = r, this.filterTimer = this._delay(function () {
                        delete this.previousFilter
                    }, 1e3)) : delete this.previousFilter
            }
            e && t.preventDefault()
        },
        _activate: function (n) {
            this.active.is(".ui-state-disabled") || (this.active.is("[aria-haspopup='true']") ? this.expand(n) : this.select(n))
        },
        refresh: function () {
            var i, t, u = this, f = this.options.icons.submenu, r = this.element.find(this.options.menus);
            this.element.toggleClass("ui-menu-icons", !!this.element.find(".ui-icon").length);
            r.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-front").hide().attr({
                role: this.options.role,
                "aria-hidden": "true",
                "aria-expanded": "false"
            }).each(function () {
                var t = n(this), i = t.parent(),
                    r = n("<span>").addClass("ui-menu-icon ui-icon " + f).data("ui-menu-submenu-carat", !0);
                i.attr("aria-haspopup", "true").prepend(r);
                t.attr("aria-labelledby", i.attr("id"))
            });
            i = r.add(this.element);
            t = i.find(this.options.items);
            t.not(".ui-menu-item").each(function () {
                var t = n(this);
                u._isDivider(t) && t.addClass("ui-widget-content ui-menu-divider")
            });
            t.not(".ui-menu-item, .ui-menu-divider").addClass("ui-menu-item").uniqueId().attr({
                tabIndex: -1,
                role: this._itemRole()
            });
            t.filter(".ui-state-disabled").attr("aria-disabled", "true");
            this.active && !n.contains(this.element[0], this.active[0]) && this.blur()
        },
        _itemRole: function () {
            return { menu: "menuitem", listbox: "option" }[this.options.role]
        },
        _setOption: function (n, t) {
            "icons" === n && this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(t.submenu);
            "disabled" === n && this.element.toggleClass("ui-state-disabled", !!t).attr("aria-disabled", t);
            this._super(n, t)
        },
        focus: function (n, t) {
            var i, r;
            this.blur(n, n && "focus" === n.type);
            this._scrollIntoView(t);
            this.active = t.first();
            r = this.active.addClass("ui-state-focus").removeClass("ui-state-active");
            this.options.role && this.element.attr("aria-activedescendant", r.attr("id"));
            this.active.parent().closest(".ui-menu-item").addClass("ui-state-active");
            n && "keydown" === n.type ? this._close() : this.timer = this._delay(function () {
                this._close()
            }, this.delay);
            i = t.children(".ui-menu");
            i.length && n && /^mouse/.test(n.type) && this._startOpening(i);
            this.activeMenu = t.parent();
            this._trigger("focus", n, { item: t })
        },
        _scrollIntoView: function (t) {
            var e, o, i, r, u, f;
            this._hasScroll() && (e = parseFloat(n.css(this.activeMenu[0], "borderTopWidth")) || 0, o = parseFloat(n.css(this.activeMenu[0], "paddingTop")) || 0, i = t.offset().top - this.activeMenu.offset().top - e - o, r = this.activeMenu.scrollTop(), u = this.activeMenu.height(), f = t.outerHeight(), 0 > i ? this.activeMenu.scrollTop(r + i) : i + f > u && this.activeMenu.scrollTop(r + i - u + f))
        },
        blur: function (n, t) {
            t || clearTimeout(this.timer);
            this.active && (this.active.removeClass("ui-state-focus"), this.active = null, this._trigger("blur", n, { item: this.active }))
        },
        _startOpening: function (n) {
            clearTimeout(this.timer);
            "true" === n.attr("aria-hidden") && (this.timer = this._delay(function () {
                this._close();
                this._open(n)
            }, this.delay))
        },
        _open: function (t) {
            var i = n.extend({ of: this.active }, this.options.position);
            clearTimeout(this.timer);
            this.element.find(".ui-menu").not(t.parents(".ui-menu")).hide().attr("aria-hidden", "true");
            t.show().removeAttr("aria-hidden").attr("aria-expanded", "true").position(i)
        },
        collapseAll: function (t, i) {
            clearTimeout(this.timer);
            this.timer = this._delay(function () {
                var r = i ? this.element : n(t && t.target).closest(this.element.find(".ui-menu"));
                r.length || (r = this.element);
                this._close(r);
                this.blur(t);
                this.activeMenu = r
            }, this.delay)
        },
        _close: function (n) {
            n || (n = this.active ? this.active.parent() : this.element);
            n.find(".ui-menu").hide().attr("aria-hidden", "true").attr("aria-expanded", "false").end().find(".ui-state-active").not(".ui-state-focus").removeClass("ui-state-active")
        },
        _closeOnDocumentClick: function (t) {
            return !n(t.target).closest(".ui-menu").length
        },
        _isDivider: function (n) {
            return !/[^\-\u2014\u2013\s]/.test(n.text())
        },
        collapse: function (n) {
            var t = this.active && this.active.parent().closest(".ui-menu-item", this.element);
            t && t.length && (this._close(), this.focus(n, t))
        },
        expand: function (n) {
            var t = this.active && this.active.children(".ui-menu ").find(this.options.items).first();
            t && t.length && (this._open(t.parent()), this._delay(function () {
                this.focus(n, t)
            }))
        },
        next: function (n) {
            this._move("next", "first", n)
        },
        previous: function (n) {
            this._move("prev", "last", n)
        },
        isFirstItem: function () {
            return this.active && !this.active.prevAll(".ui-menu-item").length
        },
        isLastItem: function () {
            return this.active && !this.active.nextAll(".ui-menu-item").length
        },
        _move: function (n, t, i) {
            var r;
            this.active && (r = "first" === n || "last" === n ? this.active["first" === n ? "prevAll" : "nextAll"](".ui-menu-item").eq(-1) : this.active[n + "All"](".ui-menu-item").eq(0));
            r && r.length && this.active || (r = this.activeMenu.find(this.options.items)[t]());
            this.focus(i, r)
        },
        nextPage: function (t) {
            var i, r, u;
            return this.active ? (this.isLastItem() || (this._hasScroll() ? (r = this.active.offset().top, u = this.element.height(), this.active.nextAll(".ui-menu-item").each(function () {
                return i = n(this), 0 > i.offset().top - r - u
            }), this.focus(t, i)) : this.focus(t, this.activeMenu.find(this.options.items)[this.active ? "last" : "first"]())), void 0) : (this.next(t), void 0)
        },
        previousPage: function (t) {
            var i, r, u;
            return this.active ? (this.isFirstItem() || (this._hasScroll() ? (r = this.active.offset().top, u = this.element.height(), this.active.prevAll(".ui-menu-item").each(function () {
                return i = n(this), i.offset().top - r + u > 0
            }), this.focus(t, i)) : this.focus(t, this.activeMenu.find(this.options.items).first())), void 0) : (this.next(t), void 0)
        },
        _hasScroll: function () {
            return this.element.outerHeight() < this.element.prop("scrollHeight")
        },
        select: function (t) {
            this.active = this.active || n(t.target).closest(".ui-menu-item");
            var i = { item: this.active };
            this.active.has(".ui-menu").length || this.collapseAll(t, !0);
            this._trigger("select", t, i)
        },
        _filterMenuItems: function (t) {
            var i = t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), r = RegExp("^" + i, "i");
            return this.activeMenu.find(this.options.items).filter(".ui-menu-item").filter(function () {
                return r.test(n.trim(n(this).text()))
            })
        }
    });
    n.widget("ui.autocomplete", {
        version: "1.11.4",
        defaultElement: "<input>",
        options: {
            appendTo: null,
            autoFocus: !1,
            delay: 300,
            minLength: 1,
            position: { my: "left top", at: "left bottom", collision: "none" },
            source: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            response: null,
            search: null,
            select: null
        },
        requestIndex: 0,
        pending: 0,
        _create: function () {
            var t, i, r, u = this.element[0].nodeName.toLowerCase(), f = "textarea" === u, e = "input" === u;
            this.isMultiLine = f ? !0 : e ? !1 : this.element.prop("isContentEditable");
            this.valueMethod = this.element[f || e ? "val" : "text"];
            this.isNewMenu = !0;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off");
            this._on(this.element, {
                keydown: function (u) {
                    if (this.element.prop("readOnly")) return t = !0, r = !0, i = !0, void 0;
                    t = !1;
                    r = !1;
                    i = !1;
                    var f = n.ui.keyCode;
                    switch (u.keyCode) {
                        case f.PAGE_UP:
                            t = !0;
                            this._move("previousPage", u);
                            break;
                        case f.PAGE_DOWN:
                            t = !0;
                            this._move("nextPage", u);
                            break;
                        case f.UP:
                            t = !0;
                            this._keyEvent("previous", u);
                            break;
                        case f.DOWN:
                            t = !0;
                            this._keyEvent("next", u);
                            break;
                        case f.ENTER:
                            this.menu.active && (t = !0, u.preventDefault(), this.menu.select(u));
                            break;
                        case f.TAB:
                            this.menu.active && this.menu.select(u);
                            break;
                        case f.ESCAPE:
                            this.menu.element.is(":visible") && (this.isMultiLine || this._value(this.term), this.close(u), u.preventDefault());
                            break;
                        default:
                            i = !0;
                            this._searchTimeout(u)
                    }
                }, keypress: function (r) {
                    if (t) return t = !1, (!this.isMultiLine || this.menu.element.is(":visible")) && r.preventDefault(), void 0;
                    if (!i) {
                        var u = n.ui.keyCode;
                        switch (r.keyCode) {
                            case u.PAGE_UP:
                                this._move("previousPage", r);
                                break;
                            case u.PAGE_DOWN:
                                this._move("nextPage", r);
                                break;
                            case u.UP:
                                this._keyEvent("previous", r);
                                break;
                            case u.DOWN:
                                this._keyEvent("next", r)
                        }
                    }
                }, input: function (n) {
                    return r ? (r = !1, n.preventDefault(), void 0) : (this._searchTimeout(n), void 0)
                }, focus: function () {
                    this.selectedItem = null;
                    this.previous = this._value()
                }, blur: function (n) {
                    return this.cancelBlur ? (delete this.cancelBlur, void 0) : (clearTimeout(this.searching), this.close(n), this._change(n), void 0)
                }
            });
            this._initSource();
            this.menu = n("<ul>").addClass("ui-autocomplete ui-front").appendTo(this._appendTo()).menu({ role: null }).hide().menu("instance");
            this._on(this.menu.element, {
                mousedown: function (t) {
                    t.preventDefault();
                    this.cancelBlur = !0;
                    this._delay(function () {
                        delete this.cancelBlur
                    });
                    var i = this.menu.element[0];
                    n(t.target).closest(".ui-menu-item").length || this._delay(function () {
                        var t = this;
                        this.document.one("mousedown", function (r) {
                            r.target === t.element[0] || r.target === i || n.contains(i, r.target) || t.close()
                        })
                    })
                }, menufocus: function (t, i) {
                    var r, u;
                    return this.isNewMenu && (this.isNewMenu = !1, t.originalEvent && /^mouse/.test(t.originalEvent.type)) ? (this.menu.blur(), this.document.one("mousemove", function () {
                        n(t.target).trigger(t.originalEvent)
                    }), void 0) : (u = i.item.data("ui-autocomplete-item"), !1 !== this._trigger("focus", t, { item: u }) && t.originalEvent && /^key/.test(t.originalEvent.type) && this._value(u.value), r = i.item.attr("aria-label") || u.value, r && n.trim(r).length && (this.liveRegion.children().hide(), n("<div>").text(r).appendTo(this.liveRegion)), void 0)
                }, menuselect: function (n, t) {
                    var i = t.item.data("ui-autocomplete-item"), r = this.previous;
                    this.element[0] !== this.document[0].activeElement && (this.element.focus(), this.previous = r, this._delay(function () {
                        this.previous = r;
                        this.selectedItem = i
                    }));
                    !1 !== this._trigger("select", n, { item: i }) && this._value(i.value);
                    this.term = this._value();
                    this.close(n);
                    this.selectedItem = i
                }
            });
            this.liveRegion = n("<span>", {
                role: "status",
                "aria-live": "assertive",
                "aria-relevant": "additions"
            }).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body);
            this._on(this.window, {
                beforeunload: function () {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _destroy: function () {
            clearTimeout(this.searching);
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete");
            this.menu.element.remove();
            this.liveRegion.remove()
        },
        _setOption: function (n, t) {
            this._super(n, t);
            "source" === n && this._initSource();
            "appendTo" === n && this.menu.element.appendTo(this._appendTo());
            "disabled" === n && t && this.xhr && this.xhr.abort()
        },
        _appendTo: function () {
            var t = this.options.appendTo;
            return t && (t = t.jquery || t.nodeType ? n(t) : this.document.find(t).eq(0)), t && t[0] || (t = this.element.closest(".ui-front")), t.length || (t = this.document[0].body), t
        },
        _initSource: function () {
            var i, r, t = this;
            n.isArray(this.options.source) ? (i = this.options.source, this.source = function (t, r) {
                r(n.ui.autocomplete.filter(i, t.term))
            }) : "string" == typeof this.options.source ? (r = this.options.source, this.source = function (i, u) {
                t.xhr && t.xhr.abort();
                t.xhr = n.ajax({
                    url: r, data: i, dataType: "json", success: function (n) {
                        u(n)
                    }, error: function () {
                        u([])
                    }
                })
            }) : this.source = this.options.source
        },
        _searchTimeout: function (n) {
            clearTimeout(this.searching);
            this.searching = this._delay(function () {
                var t = this.term === this._value(), i = this.menu.element.is(":visible"),
                    r = n.altKey || n.ctrlKey || n.metaKey || n.shiftKey;
                t && (!t || i || r) || (this.selectedItem = null, this.search(null, n))
            }, this.options.delay)
        },
        search: function (n, t) {
            return n = null != n ? n : this._value(), this.term = this._value(), n.length < this.options.minLength ? this.close(t) : this._trigger("search", t) !== !1 ? this._search(n) : void 0
        },
        _search: function (n) {
            this.pending++;
            this.element.addClass("ui-autocomplete-loading");
            this.cancelSearch = !1;
            this.source({ term: n }, this._response())
        },
        _response: function () {
            var t = ++this.requestIndex;
            return n.proxy(function (n) {
                t === this.requestIndex && this.__response(n);
                this.pending--;
                this.pending || this.element.removeClass("ui-autocomplete-loading")
            }, this)
        },
        __response: function (n) {
            n && (n = this._normalize(n));
            this._trigger("response", null, { content: n });
            !this.options.disabled && n && n.length && !this.cancelSearch ? (this._suggest(n), this._trigger("open")) : this._close()
        },
        close: function (n) {
            this.cancelSearch = !0;
            this._close(n)
        },
        _close: function (n) {
            this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.blur(), this.isNewMenu = !0, this._trigger("close", n))
        },
        _change: function (n) {
            this.previous !== this._value() && this._trigger("change", n, { item: this.selectedItem })
        },
        _normalize: function (t) {
            return t.length && t[0].label && t[0].value ? t : n.map(t, function (t) {
                return "string" == typeof t ? { label: t, value: t } : n.extend({}, t, {
                    label: t.label || t.value,
                    value: t.value || t.label
                })
            })
        },
        _suggest: function (t) {
            var i = this.menu.element.empty();
            this._renderMenu(i, t);
            this.isNewMenu = !0;
            this.menu.refresh();
            i.show();
            this._resizeMenu();
            i.position(n.extend({ of: this.element }, this.options.position));
            this.options.autoFocus && this.menu.next()
        },
        _resizeMenu: function () {
            var n = this.menu.element;
            n.outerWidth(Math.max(n.width("").outerWidth() + 1, this.element.outerWidth()))
        },
        _renderMenu: function (t, i) {
            var r = this;
            n.each(i, function (n, i) {
                r._renderItemData(t, i)
            })
        },
        _renderItemData: function (n, t) {
            return this._renderItem(n, t).data("ui-autocomplete-item", t)
        },
        _renderItem: function (t, i) {
            return n("<li>").text(i.label).appendTo(t)
        },
        _move: function (n, t) {
            return this.menu.element.is(":visible") ? this.menu.isFirstItem() && /^previous/.test(n) || this.menu.isLastItem() && /^next/.test(n) ? (this.isMultiLine || this._value(this.term), this.menu.blur(), void 0) : (this.menu[n](t), void 0) : (this.search(null, t), void 0)
        },
        widget: function () {
            return this.menu.element
        },
        _value: function () {
            return this.valueMethod.apply(this.element, arguments)
        },
        _keyEvent: function (n, t) {
            (!this.isMultiLine || this.menu.element.is(":visible")) && (this._move(n, t), t.preventDefault())
        }
    });
    n.extend(n.ui.autocomplete, {
        escapeRegex: function (n) {
            return n.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
        }, filter: function (t, i) {
            var r = RegExp(n.ui.autocomplete.escapeRegex(i), "i");
            return n.grep(t, function (n) {
                return r.test(n.label || n.value || n)
            })
        }
    });
    n.widget("ui.autocomplete", n.ui.autocomplete, {
        options: {
            messages: {
                noResults: "No search results.",
                results: function (n) {
                    return n + (n > 1 ? " results are" : " result is") + " available, use up and down arrow keys to navigate."
                }
            }
        }, __response: function (t) {
            var i;
            this._superApply(arguments);
            this.options.disabled || this.cancelSearch || (i = t && t.length ? this.options.messages.results(t.length) : this.options.messages.noResults, this.liveRegion.children().hide(), n("<div>").text(i).appendTo(this.liveRegion))
        }
    });
    n.ui.autocomplete;
    var e, p = "ui-button ui-widget ui-state-default ui-corner-all",
        w = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
        d = function () {
            var t = n(this);
            setTimeout(function () {
                t.find(":ui-button").button("refresh")
            }, 1)
        }, b = function (t) {
            var i = t.name, r = t.form, u = n([]);
            return i && (i = i.replace(/'/g, "\\'"), u = r ? n(r).find("[name='" + i + "'][type=radio]") : n("[name='" + i + "'][type=radio]", t.ownerDocument).filter(function () {
                return !this.form
            })), u
        };
    n.widget("ui.button", {
        version: "1.11.4",
        defaultElement: "<button>",
        options: { disabled: null, text: !0, label: null, icons: { primary: null, secondary: null } },
        _create: function () {
            this.element.closest("form").unbind("reset" + this.eventNamespace).bind("reset" + this.eventNamespace, d);
            "boolean" != typeof this.options.disabled ? this.options.disabled = !!this.element.prop("disabled") : this.element.prop("disabled", this.options.disabled);
            this._determineButtonType();
            this.hasTitle = !!this.buttonElement.attr("title");
            var i = this, t = this.options, r = "checkbox" === this.type || "radio" === this.type,
                u = r ? "" : "ui-state-active";
            null === t.label && (t.label = "input" === this.type ? this.buttonElement.val() : this.buttonElement.html());
            this._hoverable(this.buttonElement);
            this.buttonElement.addClass(p).attr("role", "button").bind("mouseenter" + this.eventNamespace, function () {
                t.disabled || this === e && n(this).addClass("ui-state-active")
            }).bind("mouseleave" + this.eventNamespace, function () {
                t.disabled || n(this).removeClass(u)
            }).bind("click" + this.eventNamespace, function (n) {
                t.disabled && (n.preventDefault(), n.stopImmediatePropagation())
            });
            this._on({
                focus: function () {
                    this.buttonElement.addClass("ui-state-focus")
                }, blur: function () {
                    this.buttonElement.removeClass("ui-state-focus")
                }
            });
            r && this.element.bind("change" + this.eventNamespace, function () {
                i.refresh()
            });
            "checkbox" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function () {
                if (t.disabled) return !1
            }) : "radio" === this.type ? this.buttonElement.bind("click" + this.eventNamespace, function () {
                if (t.disabled) return !1;
                n(this).addClass("ui-state-active");
                i.buttonElement.attr("aria-pressed", "true");
                var r = i.element[0];
                b(r).not(r).map(function () {
                    return n(this).button("widget")[0]
                }).removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : (this.buttonElement.bind("mousedown" + this.eventNamespace, function () {
                return t.disabled ? !1 : (n(this).addClass("ui-state-active"), e = this, i.document.one("mouseup", function () {
                    e = null
                }), void 0)
            }).bind("mouseup" + this.eventNamespace, function () {
                return t.disabled ? !1 : (n(this).removeClass("ui-state-active"), void 0)
            }).bind("keydown" + this.eventNamespace, function (i) {
                return t.disabled ? !1 : ((i.keyCode === n.ui.keyCode.SPACE || i.keyCode === n.ui.keyCode.ENTER) && n(this).addClass("ui-state-active"), void 0)
            }).bind("keyup" + this.eventNamespace + " blur" + this.eventNamespace, function () {
                n(this).removeClass("ui-state-active")
            }), this.buttonElement.is("a") && this.buttonElement.keyup(function (t) {
                t.keyCode === n.ui.keyCode.SPACE && n(this).click()
            }));
            this._setOption("disabled", t.disabled);
            this._resetButton()
        },
        _determineButtonType: function () {
            var n, t, i;
            this.type = this.element.is("[type=checkbox]") ? "checkbox" : this.element.is("[type=radio]") ? "radio" : this.element.is("input") ? "input" : "button";
            "checkbox" === this.type || "radio" === this.type ? (n = this.element.parents().last(), t = "label[for='" + this.element.attr("id") + "']", this.buttonElement = n.find(t), this.buttonElement.length || (n = n.length ? n.siblings() : this.element.siblings(), this.buttonElement = n.filter(t), this.buttonElement.length || (this.buttonElement = n.find(t))), this.element.addClass("ui-helper-hidden-accessible"), i = this.element.is(":checked"), i && this.buttonElement.addClass("ui-state-active"), this.buttonElement.prop("aria-pressed", i)) : this.buttonElement = this.element
        },
        widget: function () {
            return this.buttonElement
        },
        _destroy: function () {
            this.element.removeClass("ui-helper-hidden-accessible");
            this.buttonElement.removeClass(p + " ui-state-active " + w).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html());
            this.hasTitle || this.buttonElement.removeAttr("title")
        },
        _setOption: function (n, t) {
            return this._super(n, t), "disabled" === n ? (this.widget().toggleClass("ui-state-disabled", !!t), this.element.prop("disabled", !!t), t && ("checkbox" === this.type || "radio" === this.type ? this.buttonElement.removeClass("ui-state-focus") : this.buttonElement.removeClass("ui-state-focus ui-state-active")), void 0) : (this._resetButton(), void 0)
        },
        refresh: function () {
            var t = this.element.is("input, button") ? this.element.is(":disabled") : this.element.hasClass("ui-button-disabled");
            t !== this.options.disabled && this._setOption("disabled", t);
            "radio" === this.type ? b(this.element[0]).each(function () {
                n(this).is(":checked") ? n(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : n(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false")
            }) : "checkbox" === this.type && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false"))
        },
        _resetButton: function () {
            if ("input" === this.type) return this.options.label && this.element.val(this.options.label), void 0;
            var i = this.buttonElement.removeClass(w),
                f = n("<span><\/span>", this.document[0]).addClass("ui-button-text").html(this.options.label).appendTo(i.empty()).text(),
                t = this.options.icons, u = t.primary && t.secondary, r = [];
            t.primary || t.secondary ? (this.options.text && r.push("ui-button-text-icon" + (u ? "s" : t.primary ? "-primary" : "-secondary")), t.primary && i.prepend("<span class='ui-button-icon-primary ui-icon " + t.primary + "'><\/span>"), t.secondary && i.append("<span class='ui-button-icon-secondary ui-icon " + t.secondary + "'><\/span>"), this.options.text || (r.push(u ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || i.attr("title", n.trim(f)))) : r.push("ui-button-text-only");
            i.addClass(r.join(" "))
        }
    });
    n.widget("ui.buttonset", {
        version: "1.11.4",
        options: { items: "button, input[type=button], input[type=submit], input[type=reset], input[type=checkbox], input[type=radio], a, :data(ui-button)" },
        _create: function () {
            this.element.addClass("ui-buttonset")
        },
        _init: function () {
            this.refresh()
        },
        _setOption: function (n, t) {
            "disabled" === n && this.buttons.button("option", n, t);
            this._super(n, t)
        },
        refresh: function () {
            var i = "rtl" === this.element.css("direction"), t = this.element.find(this.options.items),
                r = t.filter(":ui-button");
            t.not(":ui-button").button();
            r.button("refresh");
            this.buttons = t.map(function () {
                return n(this).button("widget")[0]
            }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(i ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(i ? "ui-corner-left" : "ui-corner-right").end().end()
        },
        _destroy: function () {
            this.element.removeClass("ui-buttonset");
            this.buttons.map(function () {
                return n(this).button("widget")[0]
            }).removeClass("ui-corner-left ui-corner-right").end().button("destroy")
        }
    });
    n.ui.button;
    n.extend(n.ui, { datepicker: { version: "1.11.4" } });
    n.extend(l.prototype, {
        markerClassName: "hasDatepicker",
        maxRows: 4,
        _widgetDatepicker: function () {
            return this.dpDiv
        },
        setDefaults: function (n) {
            return u(this._defaults, n || {}), this
        },
        _attachDatepicker: function (t, i) {
            var r, f, u;
            r = t.nodeName.toLowerCase();
            f = "div" === r || "span" === r;
            t.id || (this.uuid += 1, t.id = "dp" + this.uuid);
            u = this._newInst(n(t), f);
            u.settings = n.extend({}, i || {});
            "input" === r ? this._connectDatepicker(t, u) : f && this._inlineDatepicker(t, u)
        },
        _newInst: function (t, i) {
            var r = t[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1");
            return {
                id: r,
                input: t,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: i,
                dpDiv: i ? a(n("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'><\/div>")) : this.dpDiv
            }
        },
        _connectDatepicker: function (t, i) {
            var r = n(t);
            i.append = n([]);
            i.trigger = n([]);
            r.hasClass(this.markerClassName) || (this._attachments(r, i), r.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp), this._autoSize(i), n.data(t, "datepicker", i), i.settings.disabled && this._disableDatepicker(t))
        },
        _attachments: function (t, i) {
            var u, r, f, e = this._get(i, "appendText"), o = this._get(i, "isRTL");
            i.append && i.append.remove();
            e && (i.append = n("<span class='" + this._appendClass + "'>" + e + "<\/span>"), t[o ? "before" : "after"](i.append));
            t.unbind("focus", this._showDatepicker);
            i.trigger && i.trigger.remove();
            u = this._get(i, "showOn");
            ("focus" === u || "both" === u) && t.focus(this._showDatepicker);
            ("button" === u || "both" === u) && (r = this._get(i, "buttonText"), f = this._get(i, "buttonImage"), i.trigger = n(this._get(i, "buttonImageOnly") ? n("<img/>").addClass(this._triggerClass).attr({
                src: f,
                alt: r,
                title: r
            }) : n("<button type='button'><\/button>").addClass(this._triggerClass).html(f ? n("<img/>").attr({
                src: f,
                alt: r,
                title: r
            }) : r)), t[o ? "before" : "after"](i.trigger), i.trigger.click(function () {
                return n.datepicker._datepickerShowing && n.datepicker._lastInput === t[0] ? n.datepicker._hideDatepicker() : n.datepicker._datepickerShowing && n.datepicker._lastInput !== t[0] ? (n.datepicker._hideDatepicker(), n.datepicker._showDatepicker(t[0])) : n.datepicker._showDatepicker(t[0]), !1
            }))
        },
        _autoSize: function (n) {
            if (this._get(n, "autoSize") && !n.inline) {
                var r, u, f, t, i = new Date(2009, 11, 20), e = this._get(n, "dateFormat");
                e.match(/[DM]/) && (r = function (n) {
                    for (u = 0, f = 0, t = 0; n.length > t; t++) n[t].length > u && (u = n[t].length, f = t);
                    return f
                }, i.setMonth(r(this._get(n, e.match(/MM/) ? "monthNames" : "monthNamesShort"))), i.setDate(r(this._get(n, e.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - i.getDay()));
                n.input.attr("size", this._formatDate(n, i).length)
            }
        },
        _inlineDatepicker: function (t, i) {
            var r = n(t);
            r.hasClass(this.markerClassName) || (r.addClass(this.markerClassName).append(i.dpDiv), n.data(t, "datepicker", i), this._setDate(i, this._getDefaultDate(i), !0), this._updateDatepicker(i), this._updateAlternate(i), i.settings.disabled && this._disableDatepicker(t), i.dpDiv.css("display", "block"))
        },
        _dialogDatepicker: function (t, i, r, f, e) {
            var s, h, c, l, a, o = this._dialogInst;
            return o || (this.uuid += 1, s = "dp" + this.uuid, this._dialogInput = n("<input type='text' id='" + s + "' style='position: absolute; top: -100px; width: 0px;'/>"), this._dialogInput.keydown(this._doKeyDown), n("body").append(this._dialogInput), o = this._dialogInst = this._newInst(this._dialogInput, !1), o.settings = {}, n.data(this._dialogInput[0], "datepicker", o)), u(o.settings, f || {}), i = i && i.constructor === Date ? this._formatDate(o, i) : i, this._dialogInput.val(i), this._pos = e ? e.length ? e : [e.pageX, e.pageY] : null, this._pos || (h = document.documentElement.clientWidth, c = document.documentElement.clientHeight, l = document.documentElement.scrollLeft || document.body.scrollLeft, a = document.documentElement.scrollTop || document.body.scrollTop, this._pos = [h / 2 - 100 + l, c / 2 - 150 + a]), this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), o.settings.onSelect = r, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), n.blockUI && n.blockUI(this.dpDiv), n.data(this._dialogInput[0], "datepicker", o), this
        },
        _destroyDatepicker: function (t) {
            var r, u = n(t), f = n.data(t, "datepicker");
            u.hasClass(this.markerClassName) && (r = t.nodeName.toLowerCase(), n.removeData(t, "datepicker"), "input" === r ? (f.append.remove(), f.trigger.remove(), u.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : ("div" === r || "span" === r) && u.removeClass(this.markerClassName).empty(), i === f && (i = null))
        },
        _enableDatepicker: function (t) {
            var i, r, u = n(t), f = n.data(t, "datepicker");
            u.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), "input" === i ? (t.disabled = !1, f.trigger.filter("button").each(function () {
                this.disabled = !1
            }).end().filter("img").css({
                opacity: "1.0",
                cursor: ""
            })) : ("div" === i || "span" === i) && (r = u.children("." + this._inlineClass), r.children().removeClass("ui-state-disabled"), r.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !1)), this._disabledInputs = n.map(this._disabledInputs, function (n) {
                return n === t ? null : n
            }))
        },
        _disableDatepicker: function (t) {
            var i, r, u = n(t), f = n.data(t, "datepicker");
            u.hasClass(this.markerClassName) && (i = t.nodeName.toLowerCase(), "input" === i ? (t.disabled = !0, f.trigger.filter("button").each(function () {
                this.disabled = !0
            }).end().filter("img").css({
                opacity: "0.5",
                cursor: "default"
            })) : ("div" === i || "span" === i) && (r = u.children("." + this._inlineClass), r.children().addClass("ui-state-disabled"), r.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled", !0)), this._disabledInputs = n.map(this._disabledInputs, function (n) {
                return n === t ? null : n
            }), this._disabledInputs[this._disabledInputs.length] = t)
        },
        _isDisabledDatepicker: function (n) {
            if (!n) return !1;
            for (var t = 0; this._disabledInputs.length > t; t++) if (this._disabledInputs[t] === n) return !0;
            return !1
        },
        _getInst: function (t) {
            try {
                return n.data(t, "datepicker")
            } catch (i) {
                throw "Missing instance data for this datepicker";
            }
        },
        _optionDatepicker: function (t, i, r) {
            var e, h, o, s, f = this._getInst(t);
            return 2 === arguments.length && "string" == typeof i ? "defaults" === i ? n.extend({}, n.datepicker._defaults) : f ? "all" === i ? n.extend({}, f.settings) : this._get(f, i) : null : (e = i || {}, "string" == typeof i && (e = {}, e[i] = r), f && (this._curInst === f && this._hideDatepicker(), h = this._getDateDatepicker(t, !0), o = this._getMinMaxDate(f, "min"), s = this._getMinMaxDate(f, "max"), u(f.settings, e), null !== o && void 0 !== e.dateFormat && void 0 === e.minDate && (f.settings.minDate = this._formatDate(f, o)), null !== s && void 0 !== e.dateFormat && void 0 === e.maxDate && (f.settings.maxDate = this._formatDate(f, s)), "disabled" in e && (e.disabled ? this._disableDatepicker(t) : this._enableDatepicker(t)), this._attachments(n(t), f), this._autoSize(f), this._setDate(f, h), this._updateAlternate(f), this._updateDatepicker(f)), void 0)
        },
        _changeDatepicker: function (n, t, i) {
            this._optionDatepicker(n, t, i)
        },
        _refreshDatepicker: function (n) {
            var t = this._getInst(n);
            t && this._updateDatepicker(t)
        },
        _setDateDatepicker: function (n, t) {
            var i = this._getInst(n);
            i && (this._setDate(i, t), this._updateDatepicker(i), this._updateAlternate(i))
        },
        _getDateDatepicker: function (n, t) {
            var i = this._getInst(n);
            return i && !i.inline && this._setDateFromField(i, t), i ? this._getDate(i) : null
        },
        _doKeyDown: function (t) {
            var u, e, f, i = n.datepicker._getInst(t.target), r = !0, o = i.dpDiv.is(".ui-datepicker-rtl");
            if (i._keyEvent = !0, n.datepicker._datepickerShowing) switch (t.keyCode) {
                case 9:
                    n.datepicker._hideDatepicker();
                    r = !1;
                    break;
                case 13:
                    return f = n("td." + n.datepicker._dayOverClass + ":not(." + n.datepicker._currentClass + ")", i.dpDiv), f[0] && n.datepicker._selectDay(t.target, i.selectedMonth, i.selectedYear, f[0]), u = n.datepicker._get(i, "onSelect"), u ? (e = n.datepicker._formatDate(i), u.apply(i.input ? i.input[0] : null, [e, i])) : n.datepicker._hideDatepicker(), !1;
                case 27:
                    n.datepicker._hideDatepicker();
                    break;
                case 33:
                    n.datepicker._adjustDate(t.target, t.ctrlKey ? -n.datepicker._get(i, "stepBigMonths") : -n.datepicker._get(i, "stepMonths"), "M");
                    break;
                case 34:
                    n.datepicker._adjustDate(t.target, t.ctrlKey ? +n.datepicker._get(i, "stepBigMonths") : +n.datepicker._get(i, "stepMonths"), "M");
                    break;
                case 35:
                    (t.ctrlKey || t.metaKey) && n.datepicker._clearDate(t.target);
                    r = t.ctrlKey || t.metaKey;
                    break;
                case 36:
                    (t.ctrlKey || t.metaKey) && n.datepicker._gotoToday(t.target);
                    r = t.ctrlKey || t.metaKey;
                    break;
                case 37:
                    (t.ctrlKey || t.metaKey) && n.datepicker._adjustDate(t.target, o ? 1 : -1, "D");
                    r = t.ctrlKey || t.metaKey;
                    t.originalEvent.altKey && n.datepicker._adjustDate(t.target, t.ctrlKey ? -n.datepicker._get(i, "stepBigMonths") : -n.datepicker._get(i, "stepMonths"), "M");
                    break;
                case 38:
                    (t.ctrlKey || t.metaKey) && n.datepicker._adjustDate(t.target, -7, "D");
                    r = t.ctrlKey || t.metaKey;
                    break;
                case 39:
                    (t.ctrlKey || t.metaKey) && n.datepicker._adjustDate(t.target, o ? -1 : 1, "D");
                    r = t.ctrlKey || t.metaKey;
                    t.originalEvent.altKey && n.datepicker._adjustDate(t.target, t.ctrlKey ? +n.datepicker._get(i, "stepBigMonths") : +n.datepicker._get(i, "stepMonths"), "M");
                    break;
                case 40:
                    (t.ctrlKey || t.metaKey) && n.datepicker._adjustDate(t.target, 7, "D");
                    r = t.ctrlKey || t.metaKey;
                    break;
                default:
                    r = !1
            } else 36 === t.keyCode && t.ctrlKey ? n.datepicker._showDatepicker(this) : r = !1;
            r && (t.preventDefault(), t.stopPropagation())
        },
        _doKeyPress: function (t) {
            var i, r, u = n.datepicker._getInst(t.target);
            if (n.datepicker._get(u, "constrainInput")) return (i = n.datepicker._possibleChars(n.datepicker._get(u, "dateFormat")), r = String.fromCharCode(null == t.charCode ? t.keyCode : t.charCode), t.ctrlKey || t.metaKey || " " > r || !i || i.indexOf(r) > -1)
        },
        _doKeyUp: function (t) {
            var r, i = n.datepicker._getInst(t.target);
            if (i.input.val() !== i.lastVal) try {
                r = n.datepicker.parseDate(n.datepicker._get(i, "dateFormat"), i.input ? i.input.val() : null, n.datepicker._getFormatConfig(i));
                r && (n.datepicker._setDateFromField(i), n.datepicker._updateAlternate(i), n.datepicker._updateDatepicker(i))
            } catch (u) {
            }
            return !0
        },
        _showDatepicker: function (t) {
            if (t = t.target || t, "input" !== t.nodeName.toLowerCase() && (t = n("input", t.parentNode)[0]), !n.datepicker._isDisabledDatepicker(t) && n.datepicker._lastInput !== t) {
                var i, o, s, r, f, e, h;
                i = n.datepicker._getInst(t);
                n.datepicker._curInst && n.datepicker._curInst !== i && (n.datepicker._curInst.dpDiv.stop(!0, !0), i && n.datepicker._datepickerShowing && n.datepicker._hideDatepicker(n.datepicker._curInst.input[0]));
                o = n.datepicker._get(i, "beforeShow");
                s = o ? o.apply(t, [t, i]) : {};
                s !== !1 && (u(i.settings, s), i.lastVal = null, n.datepicker._lastInput = t, n.datepicker._setDateFromField(i), n.datepicker._inDialog && (t.value = ""), n.datepicker._pos || (n.datepicker._pos = n.datepicker._findPos(t), n.datepicker._pos[1] += t.offsetHeight), r = !1, n(t).parents().each(function () {
                    return r |= "fixed" === n(this).css("position"), !r
                }), f = {
                    left: n.datepicker._pos[0],
                    top: n.datepicker._pos[1]
                }, n.datepicker._pos = null, i.dpDiv.empty(), i.dpDiv.css({
                    position: "absolute",
                    display: "block",
                    top: "-1000px"
                }), n.datepicker._updateDatepicker(i), f = n.datepicker._checkOffset(i, f, r), i.dpDiv.css({
                    position: n.datepicker._inDialog && n.blockUI ? "static" : r ? "fixed" : "absolute",
                    display: "none",
                    left: f.left + "px",
                    top: f.top + "px"
                }), i.inline || (e = n.datepicker._get(i, "showAnim"), h = n.datepicker._get(i, "duration"), i.dpDiv.css("z-index", k(n(t)) + 1), n.datepicker._datepickerShowing = !0, n.effects && n.effects.effect[e] ? i.dpDiv.show(e, n.datepicker._get(i, "showOptions"), h) : i.dpDiv[e || "show"](e ? h : null), n.datepicker._shouldFocusInput(i) && i.input.focus(), n.datepicker._curInst = i))
            }
        },
        _updateDatepicker: function (t) {
            this.maxRows = 4;
            i = t;
            t.dpDiv.empty().append(this._generateHTML(t));
            this._attachHandlers(t);
            var r, u = this._getNumberOfMonths(t), f = u[1], e = t.dpDiv.find("." + this._dayOverClass + " a");
            e.length > 0 && v.apply(e.get(0));
            t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
            f > 1 && t.dpDiv.addClass("ui-datepicker-multi-" + f).css("width", 17 * f + "em");
            t.dpDiv[(1 !== u[0] || 1 !== u[1] ? "add" : "remove") + "Class"]("ui-datepicker-multi");
            t.dpDiv[(this._get(t, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl");
            t === n.datepicker._curInst && n.datepicker._datepickerShowing && n.datepicker._shouldFocusInput(t) && t.input.focus();
            t.yearshtml && (r = t.yearshtml, setTimeout(function () {
                r === t.yearshtml && t.yearshtml && t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml);
                r = t.yearshtml = null
            }, 0))
        },
        _shouldFocusInput: function (n) {
            return n.input && n.input.is(":visible") && !n.input.is(":disabled") && !n.input.is(":focus")
        },
        _checkOffset: function (t, i, r) {
            var u = t.dpDiv.outerWidth(), f = t.dpDiv.outerHeight(), h = t.input ? t.input.outerWidth() : 0,
                o = t.input ? t.input.outerHeight() : 0,
                e = document.documentElement.clientWidth + (r ? 0 : n(document).scrollLeft()),
                s = document.documentElement.clientHeight + (r ? 0 : n(document).scrollTop());
            return i.left -= this._get(t, "isRTL") ? u - h : 0, i.left -= r && i.left === t.input.offset().left ? n(document).scrollLeft() : 0, i.top -= r && i.top === t.input.offset().top + o ? n(document).scrollTop() : 0, i.left -= Math.min(i.left, i.left + u > e && e > u ? Math.abs(i.left + u - e) : 0), i.top -= Math.min(i.top, i.top + f > s && s > f ? Math.abs(f + o) : 0), i
        },
        _findPos: function (t) {
            for (var i, r = this._getInst(t), u = this._get(r, "isRTL"); t && ("hidden" === t.type || 1 !== t.nodeType || n.expr.filters.hidden(t));) t = t[u ? "previousSibling" : "nextSibling"];
            return i = n(t).offset(), [i.left, i.top]
        },
        _hideDatepicker: function (t) {
            var r, f, u, e, i = this._curInst;
            !i || t && i !== n.data(t, "datepicker") || this._datepickerShowing && (r = this._get(i, "showAnim"), f = this._get(i, "duration"), u = function () {
                n.datepicker._tidyDialog(i)
            }, n.effects && (n.effects.effect[r] || n.effects[r]) ? i.dpDiv.hide(r, n.datepicker._get(i, "showOptions"), f, u) : i.dpDiv["slideDown" === r ? "slideUp" : "fadeIn" === r ? "fadeOut" : "hide"](r ? f : null, u), r || u(), this._datepickerShowing = !1, e = this._get(i, "onClose"), e && e.apply(i.input ? i.input[0] : null, [i.input ? i.input.val() : "", i]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                position: "absolute",
                left: "0",
                top: "-100px"
            }), n.blockUI && (n.unblockUI(), n("body").append(this.dpDiv))), this._inDialog = !1)
        },
        _tidyDialog: function (n) {
            n.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick: function (t) {
            if (n.datepicker._curInst) {
                var i = n(t.target), r = n.datepicker._getInst(i[0]);
                (i[0].id === n.datepicker._mainDivId || 0 !== i.parents("#" + n.datepicker._mainDivId).length || i.hasClass(n.datepicker.markerClassName) || i.closest("." + n.datepicker._triggerClass).length || !n.datepicker._datepickerShowing || n.datepicker._inDialog && n.blockUI) && (!i.hasClass(n.datepicker.markerClassName) || n.datepicker._curInst === r) || n.datepicker._hideDatepicker()
            }
        },
        _adjustDate: function (t, i, r) {
            var f = n(t), u = this._getInst(f[0]);
            this._isDisabledDatepicker(f[0]) || (this._adjustInstDate(u, i + ("M" === r ? this._get(u, "showCurrentAtPos") : 0), r), this._updateDatepicker(u))
        },
        _gotoToday: function (t) {
            var r, u = n(t), i = this._getInst(u[0]);
            this._get(i, "gotoCurrent") && i.currentDay ? (i.selectedDay = i.currentDay, i.drawMonth = i.selectedMonth = i.currentMonth, i.drawYear = i.selectedYear = i.currentYear) : (r = new Date, i.selectedDay = r.getDate(), i.drawMonth = i.selectedMonth = r.getMonth(), i.drawYear = i.selectedYear = r.getFullYear());
            this._notifyChange(i);
            this._adjustDate(u)
        },
        _selectMonthYear: function (t, i, r) {
            var f = n(t), u = this._getInst(f[0]);
            u["selected" + ("M" === r ? "Month" : "Year")] = u["draw" + ("M" === r ? "Month" : "Year")] = parseInt(i.options[i.selectedIndex].value, 10);
            this._notifyChange(u);
            this._adjustDate(f)
        },
        _selectDay: function (t, i, r, u) {
            var f, e = n(t);
            n(u).hasClass(this._unselectableClass) || this._isDisabledDatepicker(e[0]) || (f = this._getInst(e[0]), f.selectedDay = f.currentDay = n("a", u).html(), f.selectedMonth = f.currentMonth = i, f.selectedYear = f.currentYear = r, this._selectDate(t, this._formatDate(f, f.currentDay, f.currentMonth, f.currentYear)))
        },
        _clearDate: function (t) {
            var i = n(t);
            this._selectDate(i, "")
        },
        _selectDate: function (t, i) {
            var u, f = n(t), r = this._getInst(f[0]);
            i = null != i ? i : this._formatDate(r);
            r.input && r.input.val(i);
            this._updateAlternate(r);
            u = this._get(r, "onSelect");
            u ? u.apply(r.input ? r.input[0] : null, [i, r]) : r.input && r.input.trigger("change");
            r.inline ? this._updateDatepicker(r) : (this._hideDatepicker(), this._lastInput = r.input[0], "object" != typeof r.input[0] && r.input.focus(), this._lastInput = null)
        },
        _updateAlternate: function (t) {
            var i, r, u, f = this._get(t, "altField");
            f && (i = this._get(t, "altFormat") || this._get(t, "dateFormat"), r = this._getDate(t), u = this.formatDate(i, r, this._getFormatConfig(t)), n(f).each(function () {
                n(this).val(u)
            }))
        },
        noWeekends: function (n) {
            var t = n.getDay();
            return [t > 0 && 6 > t, ""]
        },
        iso8601Week: function (n) {
            var i, t = new Date(n.getTime());
            return t.setDate(t.getDate() + 4 - (t.getDay() || 7)), i = t.getTime(), t.setMonth(0), t.setDate(1), Math.floor(Math.round((i - t) / 864e5) / 7) + 1
        },
        parseDate: function (t, i, r) {
            if (null == t || null == i) throw "Invalid arguments";
            if (i = "object" == typeof i ? "" + i : i + "", "" === i) return null;
            for (var a, v, u, f = 0, y = (r ? r.shortYearCutoff : null) || this._defaults.shortYearCutoff, d = "string" != typeof y ? y : (new Date).getFullYear() % 100 + parseInt(y, 10), g = (r ? r.dayNamesShort : null) || this._defaults.dayNamesShort, nt = (r ? r.dayNames : null) || this._defaults.dayNames, tt = (r ? r.monthNamesShort : null) || this._defaults.monthNamesShort, it = (r ? r.monthNames : null) || this._defaults.monthNames, e = -1, s = -1, h = -1, p = -1, w = !1, l = function (n) {
                var i = t.length > o + 1 && t.charAt(o + 1) === n;
                return i && o++ , i
            }, c = function (n) {
                var u = l(n), r = "@" === n ? 14 : "!" === n ? 20 : "y" === n && u ? 4 : "o" === n ? 3 : 2,
                    e = "y" === n ? r : 1, o = RegExp("^\\d{" + e + "," + r + "}"), t = i.substring(f).match(o);
                if (!t) throw "Missing number at position " + f;
                return f += t[0].length, parseInt(t[0], 10)
            }, k = function (t, r, u) {
                var e = -1, o = n.map(l(t) ? u : r, function (n, t) {
                    return [[t, n]]
                }).sort(function (n, t) {
                    return -(n[1].length - t[1].length)
                });
                if (n.each(o, function (n, t) {
                    var r = t[1];
                    if (i.substr(f, r.length).toLowerCase() === r.toLowerCase()) return (e = t[0], f += r.length, !1)
                }), -1 !== e) return e + 1;
                throw "Unknown name at position " + f;
            }, b = function () {
                if (i.charAt(f) !== t.charAt(o)) throw "Unexpected literal at position " + f;
                f++
            }, o = 0; t.length > o; o++) if (w) "'" !== t.charAt(o) || l("'") ? b() : w = !1; else switch (t.charAt(o)) {
                case "d":
                    h = c("d");
                    break;
                case "D":
                    k("D", g, nt);
                    break;
                case "o":
                    p = c("o");
                    break;
                case "m":
                    s = c("m");
                    break;
                case "M":
                    s = k("M", tt, it);
                    break;
                case "y":
                    e = c("y");
                    break;
                case "@":
                    u = new Date(c("@"));
                    e = u.getFullYear();
                    s = u.getMonth() + 1;
                    h = u.getDate();
                    break;
                case "!":
                    u = new Date((c("!") - this._ticksTo1970) / 1e4);
                    e = u.getFullYear();
                    s = u.getMonth() + 1;
                    h = u.getDate();
                    break;
                case "'":
                    l("'") ? b() : w = !0;
                    break;
                default:
                    b()
            }
            if (i.length > f && (v = i.substr(f), !/^\s+/.test(v))) throw "Extra/unparsed characters found in date: " + v;
            if (-1 === e ? e = (new Date).getFullYear() : 100 > e && (e += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (d >= e ? 0 : -100)), p > -1) for (s = 1, h = p; ;) {
                if (a = this._getDaysInMonth(e, s - 1), a >= h) break;
                s++;
                h -= a
            }
            if (u = this._daylightSavingAdjust(new Date(e, s - 1, h)), u.getFullYear() !== e || u.getMonth() + 1 !== s || u.getDate() !== h) throw "Invalid date";
            return u
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: 864e9 * (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)),
        formatDate: function (n, t, i) {
            if (!t) return "";
            var u, h = (i ? i.dayNamesShort : null) || this._defaults.dayNamesShort,
                c = (i ? i.dayNames : null) || this._defaults.dayNames,
                l = (i ? i.monthNamesShort : null) || this._defaults.monthNamesShort,
                a = (i ? i.monthNames : null) || this._defaults.monthNames, f = function (t) {
                    var i = n.length > u + 1 && n.charAt(u + 1) === t;
                    return i && u++ , i
                }, e = function (n, t, i) {
                    var r = "" + t;
                    if (f(n)) for (; i > r.length;) r = "0" + r;
                    return r
                }, s = function (n, t, i, r) {
                    return f(n) ? r[t] : i[t]
                }, r = "", o = !1;
            if (t) for (u = 0; n.length > u; u++) if (o) "'" !== n.charAt(u) || f("'") ? r += n.charAt(u) : o = !1; else switch (n.charAt(u)) {
                case "d":
                    r += e("d", t.getDate(), 2);
                    break;
                case "D":
                    r += s("D", t.getDay(), h, c);
                    break;
                case "o":
                    r += e("o", Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() - new Date(t.getFullYear(), 0, 0).getTime()) / 864e5), 3);
                    break;
                case "m":
                    r += e("m", t.getMonth() + 1, 2);
                    break;
                case "M":
                    r += s("M", t.getMonth(), l, a);
                    break;
                case "y":
                    r += f("y") ? t.getFullYear() : (10 > t.getYear() % 100 ? "0" : "") + t.getYear() % 100;
                    break;
                case "@":
                    r += t.getTime();
                    break;
                case "!":
                    r += 1e4 * t.getTime() + this._ticksTo1970;
                    break;
                case "'":
                    f("'") ? r += "'" : o = !0;
                    break;
                default:
                    r += n.charAt(u)
            }
            return r
        },
        _possibleChars: function (n) {
            for (var i = "", r = !1, u = function (i) {
                var r = n.length > t + 1 && n.charAt(t + 1) === i;
                return r && t++ , r
            }, t = 0; n.length > t; t++) if (r) "'" !== n.charAt(t) || u("'") ? i += n.charAt(t) : r = !1; else switch (n.charAt(t)) {
                case "d":
                case "m":
                case "y":
                case "@":
                    i += "0123456789";
                    break;
                case "D":
                case "M":
                    return null;
                case "'":
                    u("'") ? i += "'" : r = !0;
                    break;
                default:
                    i += n.charAt(t)
            }
            return i
        },
        _get: function (n, t) {
            return void 0 !== n.settings[t] ? n.settings[t] : this._defaults[t]
        },
        _setDateFromField: function (n, t) {
            if (n.input.val() !== n.lastVal) {
                var f = this._get(n, "dateFormat"), r = n.lastVal = n.input ? n.input.val() : null,
                    u = this._getDefaultDate(n), i = u, e = this._getFormatConfig(n);
                try {
                    i = this.parseDate(f, r, e) || u
                } catch (o) {
                    r = t ? "" : r
                }
                n.selectedDay = i.getDate();
                n.drawMonth = n.selectedMonth = i.getMonth();
                n.drawYear = n.selectedYear = i.getFullYear();
                n.currentDay = r ? i.getDate() : 0;
                n.currentMonth = r ? i.getMonth() : 0;
                n.currentYear = r ? i.getFullYear() : 0;
                this._adjustInstDate(n)
            }
        },
        _getDefaultDate: function (n) {
            return this._restrictMinMax(n, this._determineDate(n, this._get(n, "defaultDate"), new Date))
        },
        _determineDate: function (t, i, r) {
            var f = function (n) {
                var t = new Date;
                return t.setDate(t.getDate() + n), t
            }, e = function (i) {
                try {
                    return n.datepicker.parseDate(n.datepicker._get(t, "dateFormat"), i, n.datepicker._getFormatConfig(t))
                } catch (h) {
                }
                for (var o = (i.toLowerCase().match(/^c/) ? n.datepicker._getDate(t) : null) || new Date, f = o.getFullYear(), e = o.getMonth(), r = o.getDate(), s = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, u = s.exec(i); u;) {
                    switch (u[2] || "d") {
                        case "d":
                        case "D":
                            r += parseInt(u[1], 10);
                            break;
                        case "w":
                        case "W":
                            r += 7 * parseInt(u[1], 10);
                            break;
                        case "m":
                        case "M":
                            e += parseInt(u[1], 10);
                            r = Math.min(r, n.datepicker._getDaysInMonth(f, e));
                            break;
                        case "y":
                        case "Y":
                            f += parseInt(u[1], 10);
                            r = Math.min(r, n.datepicker._getDaysInMonth(f, e))
                    }
                    u = s.exec(i)
                }
                return new Date(f, e, r)
            },
                u = null == i || "" === i ? r : "string" == typeof i ? e(i) : "number" == typeof i ? isNaN(i) ? r : f(i) : new Date(i.getTime());
            return u = u && "Invalid Date" == "" + u ? r : u, u && (u.setHours(0), u.setMinutes(0), u.setSeconds(0), u.setMilliseconds(0)), this._daylightSavingAdjust(u)
        },
        _daylightSavingAdjust: function (n) {
            return n ? (n.setHours(n.getHours() > 12 ? n.getHours() + 2 : 0), n) : null
        },
        _setDate: function (n, t, i) {
            var u = !t, f = n.selectedMonth, e = n.selectedYear,
                r = this._restrictMinMax(n, this._determineDate(n, t, new Date));
            n.selectedDay = n.currentDay = r.getDate();
            n.drawMonth = n.selectedMonth = n.currentMonth = r.getMonth();
            n.drawYear = n.selectedYear = n.currentYear = r.getFullYear();
            f === n.selectedMonth && e === n.selectedYear || i || this._notifyChange(n);
            this._adjustInstDate(n);
            n.input && n.input.val(u ? "" : this._formatDate(n))
        },
        _getDate: function (n) {
            return !n.currentYear || n.input && "" === n.input.val() ? null : this._daylightSavingAdjust(new Date(n.currentYear, n.currentMonth, n.currentDay))
        },
        _attachHandlers: function (t) {
            var r = this._get(t, "stepMonths"), i = "#" + t.id.replace(/\\\\/g, "\\");
            t.dpDiv.find("[data-handler]").map(function () {
                var t = {
                    prev: function () {
                        n.datepicker._adjustDate(i, -r, "M")
                    }, next: function () {
                        n.datepicker._adjustDate(i, +r, "M")
                    }, hide: function () {
                        n.datepicker._hideDatepicker()
                    }, today: function () {
                        n.datepicker._gotoToday(i)
                    }, selectDay: function () {
                        return n.datepicker._selectDay(i, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
                    }, selectMonth: function () {
                        return n.datepicker._selectMonthYear(i, this, "M"), !1
                    }, selectYear: function () {
                        return n.datepicker._selectMonthYear(i, this, "Y"), !1
                    }
                };
                n(this).bind(this.getAttribute("data-event"), t[this.getAttribute("data-handler")])
            })
        },
        _generateHTML: function (n) {
            var b, s, rt, h, ut, k, ft, et, ri, c, ot, ui, fi, ei, oi, st, g, si, ht, nt, o, y, ct, p, lt, l, u, at, vt,
                yt, pt, tt, wt, i, bt, kt, d, a, it, dt = new Date,
                gt = this._daylightSavingAdjust(new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())),
                f = this._get(n, "isRTL"), li = this._get(n, "showButtonPanel"), hi = this._get(n, "hideIfNoPrevNext"),
                ni = this._get(n, "navigationAsDateFormat"), e = this._getNumberOfMonths(n),
                ai = this._get(n, "showCurrentAtPos"), ci = this._get(n, "stepMonths"), ti = 1 !== e[0] || 1 !== e[1],
                ii = this._daylightSavingAdjust(n.currentDay ? new Date(n.currentYear, n.currentMonth, n.currentDay) : new Date(9999, 9, 9)),
                w = this._getMinMaxDate(n, "min"), v = this._getMinMaxDate(n, "max"), t = n.drawMonth - ai,
                r = n.drawYear;
            if (0 > t && (t += 12, r--), v) for (b = this._daylightSavingAdjust(new Date(v.getFullYear(), v.getMonth() - e[0] * e[1] + 1, v.getDate())), b = w && w > b ? w : b; this._daylightSavingAdjust(new Date(r, t, 1)) > b;) t-- , 0 > t && (t = 11, r--);
            for (n.drawMonth = t, n.drawYear = r, s = this._get(n, "prevText"), s = ni ? this.formatDate(s, this._daylightSavingAdjust(new Date(r, t - ci, 1)), this._getFormatConfig(n)) : s, rt = this._canAdjustMonth(n, -1, r, t) ? "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='" + s + "'><span class='ui-icon ui-icon-circle-triangle-" + (f ? "e" : "w") + "'>" + s + "<\/span><\/a>" : hi ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + s + "'><span class='ui-icon ui-icon-circle-triangle-" + (f ? "e" : "w") + "'>" + s + "<\/span><\/a>", h = this._get(n, "nextText"), h = ni ? this.formatDate(h, this._daylightSavingAdjust(new Date(r, t + ci, 1)), this._getFormatConfig(n)) : h, ut = this._canAdjustMonth(n, 1, r, t) ? "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='" + h + "'><span class='ui-icon ui-icon-circle-triangle-" + (f ? "w" : "e") + "'>" + h + "<\/span><\/a>" : hi ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + h + "'><span class='ui-icon ui-icon-circle-triangle-" + (f ? "w" : "e") + "'>" + h + "<\/span><\/a>", k = this._get(n, "currentText"), ft = this._get(n, "gotoCurrent") && n.currentDay ? ii : gt, k = ni ? this.formatDate(k, ft, this._getFormatConfig(n)) : k, et = n.inline ? "" : "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" + this._get(n, "closeText") + "<\/button>", ri = li ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (f ? et : "") + (this._isInRange(n, ft) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>" + k + "<\/button>" : "") + (f ? "" : et) + "<\/div>" : "", c = parseInt(this._get(n, "firstDay"), 10), c = isNaN(c) ? 0 : c, ot = this._get(n, "showWeek"), ui = this._get(n, "dayNames"), fi = this._get(n, "dayNamesMin"), ei = this._get(n, "monthNames"), oi = this._get(n, "monthNamesShort"), st = this._get(n, "beforeShowDay"), g = this._get(n, "showOtherMonths"), si = this._get(n, "selectOtherMonths"), ht = this._getDefaultDate(n), nt = "", y = 0; e[0] > y; y++) {
                for (ct = "", this.maxRows = 4, p = 0; e[1] > p; p++) {
                    if (lt = this._daylightSavingAdjust(new Date(r, t, n.selectedDay)), l = " ui-corner-all", u = "", ti) {
                        if (u += "<div class='ui-datepicker-group", e[1] > 1) switch (p) {
                            case 0:
                                u += " ui-datepicker-group-first";
                                l = " ui-corner-" + (f ? "right" : "left");
                                break;
                            case e[1] - 1:
                                u += " ui-datepicker-group-last";
                                l = " ui-corner-" + (f ? "left" : "right");
                                break;
                            default:
                                u += " ui-datepicker-group-middle";
                                l = ""
                        }
                        u += "'>"
                    }
                    for (u += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + l + "'>" + (/all|left/.test(l) && 0 === y ? f ? ut : rt : "") + (/all|right/.test(l) && 0 === y ? f ? rt : ut : "") + this._generateMonthYearHeader(n, t, r, w, v, y > 0 || p > 0, ei, oi) + "<\/div><table class='ui-datepicker-calendar'><thead><tr>", at = ot ? "<th class='ui-datepicker-week-col'>" + this._get(n, "weekHeader") + "<\/th>" : "", o = 0; 7 > o; o++) vt = (o + c) % 7, at += "<th scope='col'" + ((o + c + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + "><span title='" + ui[vt] + "'>" + fi[vt] + "<\/span><\/th>";
                    for (u += at + "<\/tr><\/thead><tbody>", yt = this._getDaysInMonth(r, t), r === n.selectedYear && t === n.selectedMonth && (n.selectedDay = Math.min(n.selectedDay, yt)), pt = (this._getFirstDayOfMonth(r, t) - c + 7) % 7, tt = Math.ceil((pt + yt) / 7), wt = ti ? this.maxRows > tt ? this.maxRows : tt : tt, this.maxRows = wt, i = this._daylightSavingAdjust(new Date(r, t, 1 - pt)), bt = 0; wt > bt; bt++) {
                        for (u += "<tr>", kt = ot ? "<td class='ui-datepicker-week-col'>" + this._get(n, "calculateWeek")(i) + "<\/td>" : "", o = 0; 7 > o; o++) d = st ? st.apply(n.input ? n.input[0] : null, [i]) : [!0, ""], a = i.getMonth() !== t, it = a && !si || !d[0] || w && w > i || v && i > v, kt += "<td class='" + ((o + c + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (a ? " ui-datepicker-other-month" : "") + (i.getTime() === lt.getTime() && t === n.selectedMonth && n._keyEvent || ht.getTime() === i.getTime() && ht.getTime() === lt.getTime() ? " " + this._dayOverClass : "") + (it ? " " + this._unselectableClass + " ui-state-disabled" : "") + (a && !g ? "" : " " + d[1] + (i.getTime() === ii.getTime() ? " " + this._currentClass : "") + (i.getTime() === gt.getTime() ? " ui-datepicker-today" : "")) + "'" + (a && !g || !d[2] ? "" : " title='" + d[2].replace(/'/g, "&#39;") + "'") + (it ? "" : " data-handler='selectDay' data-event='click' data-month='" + i.getMonth() + "' data-year='" + i.getFullYear() + "'") + ">" + (a && !g ? "&#xa0;" : it ? "<span class='ui-state-default'>" + i.getDate() + "<\/span>" : "<a class='ui-state-default" + (i.getTime() === gt.getTime() ? " ui-state-highlight" : "") + (i.getTime() === ii.getTime() ? " ui-state-active" : "") + (a ? " ui-priority-secondary" : "") + "' href='#'>" + i.getDate() + "<\/a>") + "<\/td>", i.setDate(i.getDate() + 1), i = this._daylightSavingAdjust(i);
                        u += kt + "<\/tr>"
                    }
                    t++;
                    t > 11 && (t = 0, r++);
                    u += "<\/tbody><\/table>" + (ti ? "<\/div>" + (e[0] > 0 && p === e[1] - 1 ? "<div class='ui-datepicker-row-break'><\/div>" : "") : "");
                    ct += u
                }
                nt += ct
            }
            return nt += ri, n._keyEvent = !1, nt
        },
        _generateMonthYearHeader: function (n, t, i, r, u, f, e, o) {
            var k, d, h, v, y, p, s, a, w = this._get(n, "changeMonth"), b = this._get(n, "changeYear"),
                g = this._get(n, "showMonthAfterYear"), c = "<div class='ui-datepicker-title'>", l = "";
            if (f || !w) l += "<span class='ui-datepicker-month'>" + e[t] + "<\/span>"; else {
                for (k = r && r.getFullYear() === i, d = u && u.getFullYear() === i, l += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>", h = 0; 12 > h; h++) (!k || h >= r.getMonth()) && (!d || u.getMonth() >= h) && (l += "<option value='" + h + "'" + (h === t ? " selected='selected'" : "") + ">" + o[h] + "<\/option>");
                l += "<\/select>"
            }
            if (g || (c += l + (!f && w && b ? "" : "&#xa0;")), !n.yearshtml) if (n.yearshtml = "", f || !b) c += "<span class='ui-datepicker-year'>" + i + "<\/span>"; else {
                for (v = this._get(n, "yearRange").split(":"), y = (new Date).getFullYear(), p = function (n) {
                    var t = n.match(/c[+\-].*/) ? i + parseInt(n.substring(1), 10) : n.match(/[+\-].*/) ? y + parseInt(n, 10) : parseInt(n, 10);
                    return isNaN(t) ? y : t
                }, s = p(v[0]), a = Math.max(s, p(v[1] || "")), s = r ? Math.max(s, r.getFullYear()) : s, a = u ? Math.min(a, u.getFullYear()) : a, n.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>"; a >= s; s++) n.yearshtml += "<option value='" + s + "'" + (s === i ? " selected='selected'" : "") + ">" + s + "<\/option>";
                n.yearshtml += "<\/select>";
                c += n.yearshtml;
                n.yearshtml = null
            }
            return c += this._get(n, "yearSuffix"), g && (c += (!f && w && b ? "" : "&#xa0;") + l), c + "<\/div>"
        },
        _adjustInstDate: function (n, t, i) {
            var u = n.drawYear + ("Y" === i ? t : 0), f = n.drawMonth + ("M" === i ? t : 0),
                e = Math.min(n.selectedDay, this._getDaysInMonth(u, f)) + ("D" === i ? t : 0),
                r = this._restrictMinMax(n, this._daylightSavingAdjust(new Date(u, f, e)));
            n.selectedDay = r.getDate();
            n.drawMonth = n.selectedMonth = r.getMonth();
            n.drawYear = n.selectedYear = r.getFullYear();
            ("M" === i || "Y" === i) && this._notifyChange(n)
        },
        _restrictMinMax: function (n, t) {
            var i = this._getMinMaxDate(n, "min"), r = this._getMinMaxDate(n, "max"), u = i && i > t ? i : t;
            return r && u > r ? r : u
        },
        _notifyChange: function (n) {
            var t = this._get(n, "onChangeMonthYear");
            t && t.apply(n.input ? n.input[0] : null, [n.selectedYear, n.selectedMonth + 1, n])
        },
        _getNumberOfMonths: function (n) {
            var t = this._get(n, "numberOfMonths");
            return null == t ? [1, 1] : "number" == typeof t ? [1, t] : t
        },
        _getMinMaxDate: function (n, t) {
            return this._determineDate(n, this._get(n, t + "Date"), null)
        },
        _getDaysInMonth: function (n, t) {
            return 32 - this._daylightSavingAdjust(new Date(n, t, 32)).getDate()
        },
        _getFirstDayOfMonth: function (n, t) {
            return new Date(n, t, 1).getDay()
        },
        _canAdjustMonth: function (n, t, i, r) {
            var f = this._getNumberOfMonths(n),
                u = this._daylightSavingAdjust(new Date(i, r + (0 > t ? t : f[0] * f[1]), 1));
            return 0 > t && u.setDate(this._getDaysInMonth(u.getFullYear(), u.getMonth())), this._isInRange(n, u)
        },
        _isInRange: function (n, t) {
            var i, f, e = this._getMinMaxDate(n, "min"), o = this._getMinMaxDate(n, "max"), r = null, u = null,
                s = this._get(n, "yearRange");
            return s && (i = s.split(":"), f = (new Date).getFullYear(), r = parseInt(i[0], 10), u = parseInt(i[1], 10), i[0].match(/[+\-].*/) && (r += f), i[1].match(/[+\-].*/) && (u += f)), (!e || t.getTime() >= e.getTime()) && (!o || t.getTime() <= o.getTime()) && (!r || t.getFullYear() >= r) && (!u || u >= t.getFullYear())
        },
        _getFormatConfig: function (n) {
            var t = this._get(n, "shortYearCutoff");
            return t = "string" != typeof t ? t : (new Date).getFullYear() % 100 + parseInt(t, 10), {
                shortYearCutoff: t,
                dayNamesShort: this._get(n, "dayNamesShort"),
                dayNames: this._get(n, "dayNames"),
                monthNamesShort: this._get(n, "monthNamesShort"),
                monthNames: this._get(n, "monthNames")
            }
        },
        _formatDate: function (n, t, i, r) {
            t || (n.currentDay = n.selectedDay, n.currentMonth = n.selectedMonth, n.currentYear = n.selectedYear);
            var u = t ? "object" == typeof t ? t : this._daylightSavingAdjust(new Date(r, i, t)) : this._daylightSavingAdjust(new Date(n.currentYear, n.currentMonth, n.currentDay));
            return this.formatDate(this._get(n, "dateFormat"), u, this._getFormatConfig(n))
        }
    });
    n.fn.datepicker = function (t) {
        if (!this.length) return this;
        n.datepicker.initialized || (n(document).mousedown(n.datepicker._checkExternalClick), n.datepicker.initialized = !0);
        0 === n("#" + n.datepicker._mainDivId).length && n("body").append(n.datepicker.dpDiv);
        var i = Array.prototype.slice.call(arguments, 1);
        return "string" != typeof t || "isDisabled" !== t && "getDate" !== t && "widget" !== t ? "option" === t && 2 === arguments.length && "string" == typeof arguments[1] ? n.datepicker["_" + t + "Datepicker"].apply(n.datepicker, [this[0]].concat(i)) : this.each(function () {
            "string" == typeof t ? n.datepicker["_" + t + "Datepicker"].apply(n.datepicker, [this].concat(i)) : n.datepicker._attachDatepicker(this, t)
        }) : n.datepicker["_" + t + "Datepicker"].apply(n.datepicker, [this[0]].concat(i))
    };
    n.datepicker = new l;
    n.datepicker.initialized = !1;
    n.datepicker.uuid = (new Date).getTime();
    n.datepicker.version = "1.11.4";
    n.datepicker;
    n.widget("ui.draggable", n.ui.mouse, {
        version: "1.11.4",
        widgetEventPrefix: "drag",
        options: {
            addClasses: !0,
            appendTo: "parent",
            axis: !1,
            connectToSortable: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            iframeFix: !1,
            opacity: !1,
            refreshPositions: !1,
            revert: !1,
            revertDuration: 500,
            scope: "default",
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            snap: !1,
            snapMode: "both",
            snapTolerance: 20,
            stack: !1,
            zIndex: !1,
            drag: null,
            start: null,
            stop: null
        },
        _create: function () {
            "original" === this.options.helper && this._setPositionRelative();
            this.options.addClasses && this.element.addClass("ui-draggable");
            this.options.disabled && this.element.addClass("ui-draggable-disabled");
            this._setHandleClassName();
            this._mouseInit()
        },
        _setOption: function (n, t) {
            this._super(n, t);
            "handle" === n && (this._removeHandleClassName(), this._setHandleClassName())
        },
        _destroy: function () {
            return (this.helper || this.element).is(".ui-draggable-dragging") ? (this.destroyOnClear = !0, void 0) : (this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._removeHandleClassName(), this._mouseDestroy(), void 0)
        },
        _mouseCapture: function (t) {
            var i = this.options;
            return this._blurActiveElement(t), this.helper || i.disabled || n(t.target).closest(".ui-resizable-handle").length > 0 ? !1 : (this.handle = this._getHandle(t), this.handle ? (this._blockFrames(i.iframeFix === !0 ? "iframe" : i.iframeFix), !0) : !1)
        },
        _blockFrames: function (t) {
            this.iframeBlocks = this.document.find(t).map(function () {
                var t = n(this);
                return n("<div>").css("position", "absolute").appendTo(t.parent()).outerWidth(t.outerWidth()).outerHeight(t.outerHeight()).offset(t.offset())[0]
            })
        },
        _unblockFrames: function () {
            this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
        },
        _blurActiveElement: function (t) {
            var i = this.document[0];
            if (this.handleElement.is(t.target)) try {
                i.activeElement && "body" !== i.activeElement.nodeName.toLowerCase() && n(i.activeElement).blur()
            } catch (r) {
            }
        },
        _mouseStart: function (t) {
            var i = this.options;
            return this.helper = this._createHelper(t), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), n.ui.ddmanager && (n.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(!0), this.offsetParent = this.helper.offsetParent(), this.hasFixedAncestor = this.helper.parents().filter(function () {
                return "fixed" === n(this).css("position")
            }).length > 0, this.positionAbs = this.element.offset(), this._refreshOffsets(t), this.originalPosition = this.position = this._generatePosition(t, !1), this.originalPageX = t.pageX, this.originalPageY = t.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), this._setContainment(), this._trigger("start", t) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), n.ui.ddmanager && !i.dropBehaviour && n.ui.ddmanager.prepareOffsets(this, t), this._normalizeRightBottom(), this._mouseDrag(t, !0), n.ui.ddmanager && n.ui.ddmanager.dragStart(this, t), !0)
        },
        _refreshOffsets: function (n) {
            this.offset = {
                top: this.positionAbs.top - this.margins.top,
                left: this.positionAbs.left - this.margins.left,
                scroll: !1,
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            };
            this.offset.click = { left: n.pageX - this.offset.left, top: n.pageY - this.offset.top }
        },
        _mouseDrag: function (t, i) {
            if (this.hasFixedAncestor && (this.offset.parent = this._getParentOffset()), this.position = this._generatePosition(t, !0), this.positionAbs = this._convertPositionTo("absolute"), !i) {
                var r = this._uiHash();
                if (this._trigger("drag", t, r) === !1) return this._mouseUp({}), !1;
                this.position = r.position
            }
            return this.helper[0].style.left = this.position.left + "px", this.helper[0].style.top = this.position.top + "px", n.ui.ddmanager && n.ui.ddmanager.drag(this, t), !1
        },
        _mouseStop: function (t) {
            var r = this, i = !1;
            return n.ui.ddmanager && !this.options.dropBehaviour && (i = n.ui.ddmanager.drop(this, t)), this.dropped && (i = this.dropped, this.dropped = !1), "invalid" === this.options.revert && !i || "valid" === this.options.revert && i || this.options.revert === !0 || n.isFunction(this.options.revert) && this.options.revert.call(this.element, i) ? n(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                r._trigger("stop", t) !== !1 && r._clear()
            }) : this._trigger("stop", t) !== !1 && this._clear(), !1
        },
        _mouseUp: function (t) {
            return this._unblockFrames(), n.ui.ddmanager && n.ui.ddmanager.dragStop(this, t), this.handleElement.is(t.target) && this.element.focus(), n.ui.mouse.prototype._mouseUp.call(this, t)
        },
        cancel: function () {
            return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
        },
        _getHandle: function (t) {
            return this.options.handle ? !!n(t.target).closest(this.element.find(this.options.handle)).length : !0
        },
        _setHandleClassName: function () {
            this.handleElement = this.options.handle ? this.element.find(this.options.handle) : this.element;
            this.handleElement.addClass("ui-draggable-handle")
        },
        _removeHandleClassName: function () {
            this.handleElement.removeClass("ui-draggable-handle")
        },
        _createHelper: function (t) {
            var r = this.options, u = n.isFunction(r.helper),
                i = u ? n(r.helper.apply(this.element[0], [t])) : "clone" === r.helper ? this.element.clone().removeAttr("id") : this.element;
            return i.parents("body").length || i.appendTo("parent" === r.appendTo ? this.element[0].parentNode : r.appendTo), u && i[0] === this.element[0] && this._setPositionRelative(), i[0] === this.element[0] || /(fixed|absolute)/.test(i.css("position")) || i.css("position", "absolute"), i
        },
        _setPositionRelative: function () {
            /^(?:r|a|f)/.test(this.element.css("position")) || (this.element[0].style.position = "relative")
        },
        _adjustOffsetFromHelper: function (t) {
            "string" == typeof t && (t = t.split(" "));
            n.isArray(t) && (t = { left: +t[0], top: +t[1] || 0 });
            "left" in t && (this.offset.click.left = t.left + this.margins.left);
            "right" in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left);
            "top" in t && (this.offset.click.top = t.top + this.margins.top);
            "bottom" in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _isRootNode: function (n) {
            return /(html|body)/i.test(n.tagName) || n === this.document[0]
        },
        _getParentOffset: function () {
            var t = this.offsetParent.offset(), i = this.document[0];
            return "absolute" === this.cssPosition && this.scrollParent[0] !== i && n.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), this._isRootNode(this.offsetParent[0]) && (t = {
                top: 0,
                left: 0
            }), {
                    top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                    left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
                }
        },
        _getRelativeOffset: function () {
            if ("relative" !== this.cssPosition) return { top: 0, left: 0 };
            var n = this.element.position(), t = this._isRootNode(this.scrollParent[0]);
            return {
                top: n.top - (parseInt(this.helper.css("top"), 10) || 0) + (t ? 0 : this.scrollParent.scrollTop()),
                left: n.left - (parseInt(this.helper.css("left"), 10) || 0) + (t ? 0 : this.scrollParent.scrollLeft())
            }
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.element.css("marginLeft"), 10) || 0,
                top: parseInt(this.element.css("marginTop"), 10) || 0,
                right: parseInt(this.element.css("marginRight"), 10) || 0,
                bottom: parseInt(this.element.css("marginBottom"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() }
        },
        _setContainment: function () {
            var f, t, i, r = this.options, u = this.document[0];
            return this.relativeContainer = null, r.containment ? "window" === r.containment ? (this.containment = [n(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, n(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, n(window).scrollLeft() + n(window).width() - this.helperProportions.width - this.margins.left, n(window).scrollTop() + (n(window).height() || u.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : "document" === r.containment ? (this.containment = [0, 0, n(u).width() - this.helperProportions.width - this.margins.left, (n(u).height() || u.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top], void 0) : r.containment.constructor === Array ? (this.containment = r.containment, void 0) : ("parent" === r.containment && (r.containment = this.helper[0].parentNode), t = n(r.containment), i = t[0], i && (f = /(scroll|auto)/.test(t.css("overflow")), this.containment = [(parseInt(t.css("borderLeftWidth"), 10) || 0) + (parseInt(t.css("paddingLeft"), 10) || 0), (parseInt(t.css("borderTopWidth"), 10) || 0) + (parseInt(t.css("paddingTop"), 10) || 0), (f ? Math.max(i.scrollWidth, i.offsetWidth) : i.offsetWidth) - (parseInt(t.css("borderRightWidth"), 10) || 0) - (parseInt(t.css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (f ? Math.max(i.scrollHeight, i.offsetHeight) : i.offsetHeight) - (parseInt(t.css("borderBottomWidth"), 10) || 0) - (parseInt(t.css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relativeContainer = t), void 0) : (this.containment = null, void 0)
        },
        _convertPositionTo: function (n, t) {
            t || (t = this.position);
            var i = "absolute" === n ? 1 : -1, r = this._isRootNode(this.scrollParent[0]);
            return {
                top: t.top + this.offset.relative.top * i + this.offset.parent.top * i - ("fixed" === this.cssPosition ? -this.offset.scroll.top : r ? 0 : this.offset.scroll.top) * i,
                left: t.left + this.offset.relative.left * i + this.offset.parent.left * i - ("fixed" === this.cssPosition ? -this.offset.scroll.left : r ? 0 : this.offset.scroll.left) * i
            }
        },
        _generatePosition: function (n, t) {
            var i, s, u, f, r = this.options, h = this._isRootNode(this.scrollParent[0]), e = n.pageX, o = n.pageY;
            return h && this.offset.scroll || (this.offset.scroll = {
                top: this.scrollParent.scrollTop(),
                left: this.scrollParent.scrollLeft()
            }), t && (this.containment && (this.relativeContainer ? (s = this.relativeContainer.offset(), i = [this.containment[0] + s.left, this.containment[1] + s.top, this.containment[2] + s.left, this.containment[3] + s.top]) : i = this.containment, n.pageX - this.offset.click.left < i[0] && (e = i[0] + this.offset.click.left), n.pageY - this.offset.click.top < i[1] && (o = i[1] + this.offset.click.top), n.pageX - this.offset.click.left > i[2] && (e = i[2] + this.offset.click.left), n.pageY - this.offset.click.top > i[3] && (o = i[3] + this.offset.click.top)), r.grid && (u = r.grid[1] ? this.originalPageY + Math.round((o - this.originalPageY) / r.grid[1]) * r.grid[1] : this.originalPageY, o = i ? u - this.offset.click.top >= i[1] || u - this.offset.click.top > i[3] ? u : u - this.offset.click.top >= i[1] ? u - r.grid[1] : u + r.grid[1] : u, f = r.grid[0] ? this.originalPageX + Math.round((e - this.originalPageX) / r.grid[0]) * r.grid[0] : this.originalPageX, e = i ? f - this.offset.click.left >= i[0] || f - this.offset.click.left > i[2] ? f : f - this.offset.click.left >= i[0] ? f - r.grid[0] : f + r.grid[0] : f), "y" === r.axis && (e = this.originalPageX), "x" === r.axis && (o = this.originalPageY)), {
                    top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.offset.scroll.top : h ? 0 : this.offset.scroll.top),
                    left: e - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.offset.scroll.left : h ? 0 : this.offset.scroll.left)
                }
        },
        _clear: function () {
            this.helper.removeClass("ui-draggable-dragging");
            this.helper[0] === this.element[0] || this.cancelHelperRemoval || this.helper.remove();
            this.helper = null;
            this.cancelHelperRemoval = !1;
            this.destroyOnClear && this.destroy()
        },
        _normalizeRightBottom: function () {
            "y" !== this.options.axis && "auto" !== this.helper.css("right") && (this.helper.width(this.helper.width()), this.helper.css("right", "auto"));
            "x" !== this.options.axis && "auto" !== this.helper.css("bottom") && (this.helper.height(this.helper.height()), this.helper.css("bottom", "auto"))
        },
        _trigger: function (t, i, r) {
            return r = r || this._uiHash(), n.ui.plugin.call(this, t, [i, r, this], !0), /^(drag|start|stop)/.test(t) && (this.positionAbs = this._convertPositionTo("absolute"), r.offset = this.positionAbs), n.Widget.prototype._trigger.call(this, t, i, r)
        },
        plugins: {},
        _uiHash: function () {
            return {
                helper: this.helper,
                position: this.position,
                originalPosition: this.originalPosition,
                offset: this.positionAbs
            }
        }
    });
    n.ui.plugin.add("draggable", "connectToSortable", {
        start: function (t, i, r) {
            var u = n.extend({}, i, { item: r.element });
            r.sortables = [];
            n(r.options.connectToSortable).each(function () {
                var i = n(this).sortable("instance");
                i && !i.options.disabled && (r.sortables.push(i), i.refreshPositions(), i._trigger("activate", t, u))
            })
        }, stop: function (t, i, r) {
            var u = n.extend({}, i, { item: r.element });
            r.cancelHelperRemoval = !1;
            n.each(r.sortables, function () {
                var n = this;
                n.isOver ? (n.isOver = 0, r.cancelHelperRemoval = !0, n.cancelHelperRemoval = !1, n._storedCSS = {
                    position: n.placeholder.css("position"),
                    top: n.placeholder.css("top"),
                    left: n.placeholder.css("left")
                }, n._mouseStop(t), n.options.helper = n.options._helper) : (n.cancelHelperRemoval = !0, n._trigger("deactivate", t, u))
            })
        }, drag: function (t, i, r) {
            n.each(r.sortables, function () {
                var f = !1, u = this;
                u.positionAbs = r.positionAbs;
                u.helperProportions = r.helperProportions;
                u.offset.click = r.offset.click;
                u._intersectsWith(u.containerCache) && (f = !0, n.each(r.sortables, function () {
                    return this.positionAbs = r.positionAbs, this.helperProportions = r.helperProportions, this.offset.click = r.offset.click, this !== u && this._intersectsWith(this.containerCache) && n.contains(u.element[0], this.element[0]) && (f = !1), f
                }));
                f ? (u.isOver || (u.isOver = 1, r._parent = i.helper.parent(), u.currentItem = i.helper.appendTo(u.element).data("ui-sortable-item", !0), u.options._helper = u.options.helper, u.options.helper = function () {
                    return i.helper[0]
                }, t.target = u.currentItem[0], u._mouseCapture(t, !0), u._mouseStart(t, !0, !0), u.offset.click.top = r.offset.click.top, u.offset.click.left = r.offset.click.left, u.offset.parent.left -= r.offset.parent.left - u.offset.parent.left, u.offset.parent.top -= r.offset.parent.top - u.offset.parent.top, r._trigger("toSortable", t), r.dropped = u.element, n.each(r.sortables, function () {
                    this.refreshPositions()
                }), r.currentItem = r.element, u.fromOutside = r), u.currentItem && (u._mouseDrag(t), i.position = u.position)) : u.isOver && (u.isOver = 0, u.cancelHelperRemoval = !0, u.options._revert = u.options.revert, u.options.revert = !1, u._trigger("out", t, u._uiHash(u)), u._mouseStop(t, !0), u.options.revert = u.options._revert, u.options.helper = u.options._helper, u.placeholder && u.placeholder.remove(), i.helper.appendTo(r._parent), r._refreshOffsets(t), i.position = r._generatePosition(t, !0), r._trigger("fromSortable", t), r.dropped = !1, n.each(r.sortables, function () {
                    this.refreshPositions()
                }))
            })
        }
    });
    n.ui.plugin.add("draggable", "cursor", {
        start: function (t, i, r) {
            var u = n("body"), f = r.options;
            u.css("cursor") && (f._cursor = u.css("cursor"));
            u.css("cursor", f.cursor)
        }, stop: function (t, i, r) {
            var u = r.options;
            u._cursor && n("body").css("cursor", u._cursor)
        }
    });
    n.ui.plugin.add("draggable", "opacity", {
        start: function (t, i, r) {
            var u = n(i.helper), f = r.options;
            u.css("opacity") && (f._opacity = u.css("opacity"));
            u.css("opacity", f.opacity)
        }, stop: function (t, i, r) {
            var u = r.options;
            u._opacity && n(i.helper).css("opacity", u._opacity)
        }
    });
    n.ui.plugin.add("draggable", "scroll", {
        start: function (n, t, i) {
            i.scrollParentNotHidden || (i.scrollParentNotHidden = i.helper.scrollParent(!1));
            i.scrollParentNotHidden[0] !== i.document[0] && "HTML" !== i.scrollParentNotHidden[0].tagName && (i.overflowOffset = i.scrollParentNotHidden.offset())
        }, drag: function (t, i, r) {
            var u = r.options, o = !1, e = r.scrollParentNotHidden[0], f = r.document[0];
            e !== f && "HTML" !== e.tagName ? (u.axis && "x" === u.axis || (r.overflowOffset.top + e.offsetHeight - t.pageY < u.scrollSensitivity ? e.scrollTop = o = e.scrollTop + u.scrollSpeed : t.pageY - r.overflowOffset.top < u.scrollSensitivity && (e.scrollTop = o = e.scrollTop - u.scrollSpeed)), u.axis && "y" === u.axis || (r.overflowOffset.left + e.offsetWidth - t.pageX < u.scrollSensitivity ? e.scrollLeft = o = e.scrollLeft + u.scrollSpeed : t.pageX - r.overflowOffset.left < u.scrollSensitivity && (e.scrollLeft = o = e.scrollLeft - u.scrollSpeed))) : (u.axis && "x" === u.axis || (t.pageY - n(f).scrollTop() < u.scrollSensitivity ? o = n(f).scrollTop(n(f).scrollTop() - u.scrollSpeed) : n(window).height() - (t.pageY - n(f).scrollTop()) < u.scrollSensitivity && (o = n(f).scrollTop(n(f).scrollTop() + u.scrollSpeed))), u.axis && "y" === u.axis || (t.pageX - n(f).scrollLeft() < u.scrollSensitivity ? o = n(f).scrollLeft(n(f).scrollLeft() - u.scrollSpeed) : n(window).width() - (t.pageX - n(f).scrollLeft()) < u.scrollSensitivity && (o = n(f).scrollLeft(n(f).scrollLeft() + u.scrollSpeed))));
            o !== !1 && n.ui.ddmanager && !u.dropBehaviour && n.ui.ddmanager.prepareOffsets(r, t)
        }
    });
    n.ui.plugin.add("draggable", "snap", {
        start: function (t, i, r) {
            var u = r.options;
            r.snapElements = [];
            n(u.snap.constructor !== String ? u.snap.items || ":data(ui-draggable)" : u.snap).each(function () {
                var t = n(this), i = t.offset();
                this !== r.element[0] && r.snapElements.push({
                    item: this,
                    width: t.outerWidth(),
                    height: t.outerHeight(),
                    top: i.top,
                    left: i.left
                })
            })
        }, drag: function (t, i, r) {
            for (var e, o, s, h, c, a, l, v, w, b = r.options, f = b.snapTolerance, y = i.offset.left, k = y + r.helperProportions.width, p = i.offset.top, d = p + r.helperProportions.height, u = r.snapElements.length - 1; u >= 0; u--) c = r.snapElements[u].left - r.margins.left, a = c + r.snapElements[u].width, l = r.snapElements[u].top - r.margins.top, v = l + r.snapElements[u].height, c - f > k || y > a + f || l - f > d || p > v + f || !n.contains(r.snapElements[u].item.ownerDocument, r.snapElements[u].item) ? (r.snapElements[u].snapping && r.options.snap.release && r.options.snap.release.call(r.element, t, n.extend(r._uiHash(), { snapItem: r.snapElements[u].item })), r.snapElements[u].snapping = !1) : ("inner" !== b.snapMode && (e = f >= Math.abs(l - d), o = f >= Math.abs(v - p), s = f >= Math.abs(c - k), h = f >= Math.abs(a - y), e && (i.position.top = r._convertPositionTo("relative", {
                top: l - r.helperProportions.height,
                left: 0
            }).top), o && (i.position.top = r._convertPositionTo("relative", {
                top: v,
                left: 0
            }).top), s && (i.position.left = r._convertPositionTo("relative", {
                top: 0,
                left: c - r.helperProportions.width
            }).left), h && (i.position.left = r._convertPositionTo("relative", {
                top: 0,
                left: a
            }).left)), w = e || o || s || h, "outer" !== b.snapMode && (e = f >= Math.abs(l - p), o = f >= Math.abs(v - d), s = f >= Math.abs(c - y), h = f >= Math.abs(a - k), e && (i.position.top = r._convertPositionTo("relative", {
                top: l,
                left: 0
            }).top), o && (i.position.top = r._convertPositionTo("relative", {
                top: v - r.helperProportions.height,
                left: 0
            }).top), s && (i.position.left = r._convertPositionTo("relative", {
                top: 0,
                left: c
            }).left), h && (i.position.left = r._convertPositionTo("relative", {
                top: 0,
                left: a - r.helperProportions.width
            }).left)), !r.snapElements[u].snapping && (e || o || s || h || w) && r.options.snap.snap && r.options.snap.snap.call(r.element, t, n.extend(r._uiHash(), { snapItem: r.snapElements[u].item })), r.snapElements[u].snapping = e || o || s || h || w)
        }
    });
    n.ui.plugin.add("draggable", "stack", {
        start: function (t, i, r) {
            var f, e = r.options, u = n.makeArray(n(e.stack)).sort(function (t, i) {
                return (parseInt(n(t).css("zIndex"), 10) || 0) - (parseInt(n(i).css("zIndex"), 10) || 0)
            });
            u.length && (f = parseInt(n(u[0]).css("zIndex"), 10) || 0, n(u).each(function (t) {
                n(this).css("zIndex", f + t)
            }), this.css("zIndex", f + u.length))
        }
    });
    n.ui.plugin.add("draggable", "zIndex", {
        start: function (t, i, r) {
            var u = n(i.helper), f = r.options;
            u.css("zIndex") && (f._zIndex = u.css("zIndex"));
            u.css("zIndex", f.zIndex)
        }, stop: function (t, i, r) {
            var u = r.options;
            u._zIndex && n(i.helper).css("zIndex", u._zIndex)
        }
    });
    n.ui.draggable;
    n.widget("ui.resizable", n.ui.mouse, {
        version: "1.11.4",
        widgetEventPrefix: "resize",
        options: {
            alsoResize: !1,
            animate: !1,
            animateDuration: "slow",
            animateEasing: "swing",
            aspectRatio: !1,
            autoHide: !1,
            containment: !1,
            ghost: !1,
            grid: !1,
            handles: "e,s,se",
            helper: !1,
            maxHeight: null,
            maxWidth: null,
            minHeight: 10,
            minWidth: 10,
            zIndex: 90,
            resize: null,
            start: null,
            stop: null
        },
        _num: function (n) {
            return parseInt(n, 10) || 0
        },
        _isNumber: function (n) {
            return !isNaN(parseInt(n, 10))
        },
        _hasScroll: function (t, i) {
            if ("hidden" === n(t).css("overflow")) return !1;
            var r = i && "left" === i ? "scrollLeft" : "scrollTop", u = !1;
            return t[r] > 0 ? !0 : (t[r] = 1, u = t[r] > 0, t[r] = 0, u)
        },
        _create: function () {
            var e, f, u, i, o, r = this, t = this.options;
            if (this.element.addClass("ui-resizable"), n.extend(this, {
                _aspectRatio: !!t.aspectRatio,
                aspectRatio: t.aspectRatio,
                originalElement: this.element,
                _proportionallyResizeElements: [],
                _helper: t.helper || t.ghost || t.animate ? t.helper || "ui-resizable-helper" : null
            }), this.element[0].nodeName.match(/^(canvas|textarea|input|select|button|img)$/i) && (this.element.wrap(n("<div class='ui-wrapper' style='overflow: hidden;'><\/div>").css({
                position: this.element.css("position"),
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                top: this.element.css("top"),
                left: this.element.css("left")
            })), this.element = this.element.parent().data("ui-resizable", this.element.resizable("instance")), this.elementIsWrapper = !0, this.element.css({
                marginLeft: this.originalElement.css("marginLeft"),
                marginTop: this.originalElement.css("marginTop"),
                marginRight: this.originalElement.css("marginRight"),
                marginBottom: this.originalElement.css("marginBottom")
            }), this.originalElement.css({
                marginLeft: 0,
                marginTop: 0,
                marginRight: 0,
                marginBottom: 0
            }), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({
                position: "static",
                zoom: 1,
                display: "block"
            })), this.originalElement.css({ margin: this.originalElement.css("margin") }), this._proportionallyResize()), this.handles = t.handles || (n(".ui-resizable-handle", this.element).length ? {
                n: ".ui-resizable-n",
                e: ".ui-resizable-e",
                s: ".ui-resizable-s",
                w: ".ui-resizable-w",
                se: ".ui-resizable-se",
                sw: ".ui-resizable-sw",
                ne: ".ui-resizable-ne",
                nw: ".ui-resizable-nw"
            } : "e,s,se"), this._handles = n(), this.handles.constructor === String) for ("all" === this.handles && (this.handles = "n,e,s,w,se,sw,ne,nw"), e = this.handles.split(","), this.handles = {}, f = 0; e.length > f; f++) u = n.trim(e[f]), o = "ui-resizable-" + u, i = n("<div class='ui-resizable-handle " + o + "'><\/div>"), i.css({ zIndex: t.zIndex }), "se" === u && i.addClass("ui-icon ui-icon-gripsmall-diagonal-se"), this.handles[u] = ".ui-resizable-" + u, this.element.append(i);
            this._renderAxis = function (t) {
                var i, u, f, e;
                t = t || this.element;
                for (i in this.handles) this.handles[i].constructor === String ? this.handles[i] = this.element.children(this.handles[i]).first().show() : (this.handles[i].jquery || this.handles[i].nodeType) && (this.handles[i] = n(this.handles[i]), this._on(this.handles[i], { mousedown: r._mouseDown })), this.elementIsWrapper && this.originalElement[0].nodeName.match(/^(textarea|input|select|button)$/i) && (u = n(this.handles[i], this.element), e = /sw|ne|nw|se|n|s/.test(i) ? u.outerHeight() : u.outerWidth(), f = ["padding", /ne|nw|n/.test(i) ? "Top" : /se|sw|s/.test(i) ? "Bottom" : /^e$/.test(i) ? "Right" : "Left"].join(""), t.css(f, e), this._proportionallyResize()), this._handles = this._handles.add(this.handles[i])
            };
            this._renderAxis(this.element);
            this._handles = this._handles.add(this.element.find(".ui-resizable-handle"));
            this._handles.disableSelection();
            this._handles.mouseover(function () {
                r.resizing || (this.className && (i = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i)), r.axis = i && i[1] ? i[1] : "se")
            });
            t.autoHide && (this._handles.hide(), n(this.element).addClass("ui-resizable-autohide").mouseenter(function () {
                t.disabled || (n(this).removeClass("ui-resizable-autohide"), r._handles.show())
            }).mouseleave(function () {
                t.disabled || r.resizing || (n(this).addClass("ui-resizable-autohide"), r._handles.hide())
            }));
            this._mouseInit()
        },
        _destroy: function () {
            this._mouseDestroy();
            var t, i = function (t) {
                n(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").removeData("ui-resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
            };
            return this.elementIsWrapper && (i(this.element), t = this.element, this.originalElement.css({
                position: t.css("position"),
                width: t.outerWidth(),
                height: t.outerHeight(),
                top: t.css("top"),
                left: t.css("left")
            }).insertAfter(t), t.remove()), this.originalElement.css("resize", this.originalResizeStyle), i(this.originalElement), this
        },
        _mouseCapture: function (t) {
            var r, i, u = !1;
            for (r in this.handles) i = n(this.handles[r])[0], (i === t.target || n.contains(i, t.target)) && (u = !0);
            return !this.options.disabled && u
        },
        _mouseStart: function (t) {
            var u, f, e, r = this.options, i = this.element;
            return this.resizing = !0, this._renderProxy(), u = this._num(this.helper.css("left")), f = this._num(this.helper.css("top")), r.containment && (u += n(r.containment).scrollLeft() || 0, f += n(r.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {
                left: u,
                top: f
            }, this.size = this._helper ? {
                width: this.helper.width(),
                height: this.helper.height()
            } : { width: i.width(), height: i.height() }, this.originalSize = this._helper ? {
                width: i.outerWidth(),
                height: i.outerHeight()
            } : { width: i.width(), height: i.height() }, this.sizeDiff = {
                width: i.outerWidth() - i.width(),
                height: i.outerHeight() - i.height()
            }, this.originalPosition = { left: u, top: f }, this.originalMousePosition = {
                left: t.pageX,
                top: t.pageY
            }, this.aspectRatio = "number" == typeof r.aspectRatio ? r.aspectRatio : this.originalSize.width / this.originalSize.height || 1, e = n(".ui-resizable-" + this.axis).css("cursor"), n("body").css("cursor", "auto" === e ? this.axis + "-resize" : e), i.addClass("ui-resizable-resizing"), this._propagate("start", t), !0
        },
        _mouseDrag: function (t) {
            var i, r, u = this.originalMousePosition, e = this.axis, o = t.pageX - u.left || 0,
                s = t.pageY - u.top || 0, f = this._change[e];
            return this._updatePrevProperties(), f ? (i = f.apply(this, [t, o, s]), this._updateVirtualBoundaries(t.shiftKey), (this._aspectRatio || t.shiftKey) && (i = this._updateRatio(i, t)), i = this._respectSize(i, t), this._updateCache(i), this._propagate("resize", t), r = this._applyChanges(), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), n.isEmptyObject(r) || (this._updatePrevProperties(), this._trigger("resize", t, this.ui()), this._applyChanges()), !1) : !1
        },
        _mouseStop: function (t) {
            this.resizing = !1;
            var r, u, f, e, o, s, h, c = this.options, i = this;
            return this._helper && (r = this._proportionallyResizeElements, u = r.length && /textarea/i.test(r[0].nodeName), f = u && this._hasScroll(r[0], "left") ? 0 : i.sizeDiff.height, e = u ? 0 : i.sizeDiff.width, o = {
                width: i.helper.width() - e,
                height: i.helper.height() - f
            }, s = parseInt(i.element.css("left"), 10) + (i.position.left - i.originalPosition.left) || null, h = parseInt(i.element.css("top"), 10) + (i.position.top - i.originalPosition.top) || null, c.animate || this.element.css(n.extend(o, {
                top: h,
                left: s
            })), i.helper.height(i.size.height), i.helper.width(i.size.width), this._helper && !c.animate && this._proportionallyResize()), n("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", t), this._helper && this.helper.remove(), !1
        },
        _updatePrevProperties: function () {
            this.prevPosition = { top: this.position.top, left: this.position.left };
            this.prevSize = { width: this.size.width, height: this.size.height }
        },
        _applyChanges: function () {
            var n = {};
            return this.position.top !== this.prevPosition.top && (n.top = this.position.top + "px"), this.position.left !== this.prevPosition.left && (n.left = this.position.left + "px"), this.size.width !== this.prevSize.width && (n.width = this.size.width + "px"), this.size.height !== this.prevSize.height && (n.height = this.size.height + "px"), this.helper.css(n), n
        },
        _updateVirtualBoundaries: function (n) {
            var r, u, f, e, t, i = this.options;
            t = {
                minWidth: this._isNumber(i.minWidth) ? i.minWidth : 0,
                maxWidth: this._isNumber(i.maxWidth) ? i.maxWidth : 1 / 0,
                minHeight: this._isNumber(i.minHeight) ? i.minHeight : 0,
                maxHeight: this._isNumber(i.maxHeight) ? i.maxHeight : 1 / 0
            };
            (this._aspectRatio || n) && (r = t.minHeight * this.aspectRatio, f = t.minWidth / this.aspectRatio, u = t.maxHeight * this.aspectRatio, e = t.maxWidth / this.aspectRatio, r > t.minWidth && (t.minWidth = r), f > t.minHeight && (t.minHeight = f), t.maxWidth > u && (t.maxWidth = u), t.maxHeight > e && (t.maxHeight = e));
            this._vBoundaries = t
        },
        _updateCache: function (n) {
            this.offset = this.helper.offset();
            this._isNumber(n.left) && (this.position.left = n.left);
            this._isNumber(n.top) && (this.position.top = n.top);
            this._isNumber(n.height) && (this.size.height = n.height);
            this._isNumber(n.width) && (this.size.width = n.width)
        },
        _updateRatio: function (n) {
            var t = this.position, i = this.size, r = this.axis;
            return this._isNumber(n.height) ? n.width = n.height * this.aspectRatio : this._isNumber(n.width) && (n.height = n.width / this.aspectRatio), "sw" === r && (n.left = t.left + (i.width - n.width), n.top = null), "nw" === r && (n.top = t.top + (i.height - n.height), n.left = t.left + (i.width - n.width)), n
        },
        _respectSize: function (n) {
            var t = this._vBoundaries, i = this.axis, r = this._isNumber(n.width) && t.maxWidth && t.maxWidth < n.width,
                u = this._isNumber(n.height) && t.maxHeight && t.maxHeight < n.height,
                f = this._isNumber(n.width) && t.minWidth && t.minWidth > n.width,
                e = this._isNumber(n.height) && t.minHeight && t.minHeight > n.height,
                o = this.originalPosition.left + this.originalSize.width, s = this.position.top + this.size.height,
                h = /sw|nw|w/.test(i), c = /nw|ne|n/.test(i);
            return f && (n.width = t.minWidth), e && (n.height = t.minHeight), r && (n.width = t.maxWidth), u && (n.height = t.maxHeight), f && h && (n.left = o - t.minWidth), r && h && (n.left = o - t.maxWidth), e && c && (n.top = s - t.minHeight), u && c && (n.top = s - t.maxHeight), n.width || n.height || n.left || !n.top ? n.width || n.height || n.top || !n.left || (n.left = null) : n.top = null, n
        },
        _getPaddingPlusBorderDimensions: function (n) {
            for (var t = 0, i = [], r = [n.css("borderTopWidth"), n.css("borderRightWidth"), n.css("borderBottomWidth"), n.css("borderLeftWidth")], u = [n.css("paddingTop"), n.css("paddingRight"), n.css("paddingBottom"), n.css("paddingLeft")]; 4 > t; t++) i[t] = parseInt(r[t], 10) || 0, i[t] += parseInt(u[t], 10) || 0;
            return { height: i[0] + i[2], width: i[1] + i[3] }
        },
        _proportionallyResize: function () {
            if (this._proportionallyResizeElements.length) for (var n, t = 0, i = this.helper || this.element; this._proportionallyResizeElements.length > t; t++) n = this._proportionallyResizeElements[t], this.outerDimensions || (this.outerDimensions = this._getPaddingPlusBorderDimensions(n)), n.css({
                height: i.height() - this.outerDimensions.height || 0,
                width: i.width() - this.outerDimensions.width || 0
            })
        },
        _renderProxy: function () {
            var t = this.element, i = this.options;
            this.elementOffset = t.offset();
            this._helper ? (this.helper = this.helper || n("<div style='overflow:hidden;'><\/div>"), this.helper.addClass(this._helper).css({
                width: this.element.outerWidth() - 1,
                height: this.element.outerHeight() - 1,
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                zIndex: ++i.zIndex
            }), this.helper.appendTo("body").disableSelection()) : this.helper = this.element
        },
        _change: {
            e: function (n, t) {
                return { width: this.originalSize.width + t }
            }, w: function (n, t) {
                var i = this.originalSize, r = this.originalPosition;
                return { left: r.left + t, width: i.width - t }
            }, n: function (n, t, i) {
                var r = this.originalSize, u = this.originalPosition;
                return { top: u.top + i, height: r.height - i }
            }, s: function (n, t, i) {
                return { height: this.originalSize.height + i }
            }, se: function (t, i, r) {
                return n.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [t, i, r]))
            }, sw: function (t, i, r) {
                return n.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [t, i, r]))
            }, ne: function (t, i, r) {
                return n.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [t, i, r]))
            }, nw: function (t, i, r) {
                return n.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [t, i, r]))
            }
        },
        _propagate: function (t, i) {
            n.ui.plugin.call(this, t, [i, this.ui()]);
            "resize" !== t && this._trigger(t, i, this.ui())
        },
        plugins: {},
        ui: function () {
            return {
                originalElement: this.originalElement,
                element: this.element,
                helper: this.helper,
                position: this.position,
                size: this.size,
                originalSize: this.originalSize,
                originalPosition: this.originalPosition
            }
        }
    });
    n.ui.plugin.add("resizable", "animate", {
        stop: function (t) {
            var i = n(this).resizable("instance"), u = i.options, r = i._proportionallyResizeElements,
                f = r.length && /textarea/i.test(r[0].nodeName),
                s = f && i._hasScroll(r[0], "left") ? 0 : i.sizeDiff.height, h = f ? 0 : i.sizeDiff.width,
                c = { width: i.size.width - h, height: i.size.height - s },
                e = parseInt(i.element.css("left"), 10) + (i.position.left - i.originalPosition.left) || null,
                o = parseInt(i.element.css("top"), 10) + (i.position.top - i.originalPosition.top) || null;
            i.element.animate(n.extend(c, o && e ? { top: o, left: e } : {}), {
                duration: u.animateDuration,
                easing: u.animateEasing,
                step: function () {
                    var u = {
                        width: parseInt(i.element.css("width"), 10),
                        height: parseInt(i.element.css("height"), 10),
                        top: parseInt(i.element.css("top"), 10),
                        left: parseInt(i.element.css("left"), 10)
                    };
                    r && r.length && n(r[0]).css({ width: u.width, height: u.height });
                    i._updateCache(u);
                    i._propagate("resize", t)
                }
            })
        }
    });
    n.ui.plugin.add("resizable", "containment", {
        start: function () {
            var r, f, e, o, s, h, c, t = n(this).resizable("instance"), l = t.options, a = t.element, u = l.containment,
                i = u instanceof n ? u.get(0) : /parent/.test(u) ? a.parent().get(0) : u;
            i && (t.containerElement = n(i), /document/.test(u) || u === document ? (t.containerOffset = {
                left: 0,
                top: 0
            }, t.containerPosition = { left: 0, top: 0 }, t.parentData = {
                element: n(document),
                left: 0,
                top: 0,
                width: n(document).width(),
                height: n(document).height() || document.body.parentNode.scrollHeight
            }) : (r = n(i), f = [], n(["Top", "Right", "Left", "Bottom"]).each(function (n, i) {
                f[n] = t._num(r.css("padding" + i))
            }), t.containerOffset = r.offset(), t.containerPosition = r.position(), t.containerSize = {
                height: r.innerHeight() - f[3],
                width: r.innerWidth() - f[1]
            }, e = t.containerOffset, o = t.containerSize.height, s = t.containerSize.width, h = t._hasScroll(i, "left") ? i.scrollWidth : s, c = t._hasScroll(i) ? i.scrollHeight : o, t.parentData = {
                element: i,
                left: e.left,
                top: e.top,
                width: h,
                height: c
            }))
        }, resize: function (t) {
            var o, s, h, c, i = n(this).resizable("instance"), v = i.options, r = i.containerOffset, l = i.position,
                f = i._aspectRatio || t.shiftKey, e = { top: 0, left: 0 }, a = i.containerElement, u = !0;
            a[0] !== document && /static/.test(a.css("position")) && (e = r);
            l.left < (i._helper ? r.left : 0) && (i.size.width = i.size.width + (i._helper ? i.position.left - r.left : i.position.left - e.left), f && (i.size.height = i.size.width / i.aspectRatio, u = !1), i.position.left = v.helper ? r.left : 0);
            l.top < (i._helper ? r.top : 0) && (i.size.height = i.size.height + (i._helper ? i.position.top - r.top : i.position.top), f && (i.size.width = i.size.height * i.aspectRatio, u = !1), i.position.top = i._helper ? r.top : 0);
            h = i.containerElement.get(0) === i.element.parent().get(0);
            c = /relative|absolute/.test(i.containerElement.css("position"));
            h && c ? (i.offset.left = i.parentData.left + i.position.left, i.offset.top = i.parentData.top + i.position.top) : (i.offset.left = i.element.offset().left, i.offset.top = i.element.offset().top);
            o = Math.abs(i.sizeDiff.width + (i._helper ? i.offset.left - e.left : i.offset.left - r.left));
            s = Math.abs(i.sizeDiff.height + (i._helper ? i.offset.top - e.top : i.offset.top - r.top));
            o + i.size.width >= i.parentData.width && (i.size.width = i.parentData.width - o, f && (i.size.height = i.size.width / i.aspectRatio, u = !1));
            s + i.size.height >= i.parentData.height && (i.size.height = i.parentData.height - s, f && (i.size.width = i.size.height * i.aspectRatio, u = !1));
            u || (i.position.left = i.prevPosition.left, i.position.top = i.prevPosition.top, i.size.width = i.prevSize.width, i.size.height = i.prevSize.height)
        }, stop: function () {
            var t = n(this).resizable("instance"), r = t.options, u = t.containerOffset, f = t.containerPosition,
                e = t.containerElement, i = n(t.helper), o = i.offset(), s = i.outerWidth() - t.sizeDiff.width,
                h = i.outerHeight() - t.sizeDiff.height;
            t._helper && !r.animate && /relative/.test(e.css("position")) && n(this).css({
                left: o.left - f.left - u.left,
                width: s,
                height: h
            });
            t._helper && !r.animate && /static/.test(e.css("position")) && n(this).css({
                left: o.left - f.left - u.left,
                width: s,
                height: h
            })
        }
    });
    n.ui.plugin.add("resizable", "alsoResize", {
        start: function () {
            var t = n(this).resizable("instance"), i = t.options;
            n(i.alsoResize).each(function () {
                var t = n(this);
                t.data("ui-resizable-alsoresize", {
                    width: parseInt(t.width(), 10),
                    height: parseInt(t.height(), 10),
                    left: parseInt(t.css("left"), 10),
                    top: parseInt(t.css("top"), 10)
                })
            })
        }, resize: function (t, i) {
            var r = n(this).resizable("instance"), e = r.options, u = r.originalSize, f = r.originalPosition, o = {
                height: r.size.height - u.height || 0,
                width: r.size.width - u.width || 0,
                top: r.position.top - f.top || 0,
                left: r.position.left - f.left || 0
            };
            n(e.alsoResize).each(function () {
                var t = n(this), u = n(this).data("ui-resizable-alsoresize"), r = {},
                    f = t.parents(i.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                n.each(f, function (n, t) {
                    var i = (u[t] || 0) + (o[t] || 0);
                    i && i >= 0 && (r[t] = i || null)
                });
                t.css(r)
            })
        }, stop: function () {
            n(this).removeData("resizable-alsoresize")
        }
    });
    n.ui.plugin.add("resizable", "ghost", {
        start: function () {
            var t = n(this).resizable("instance"), i = t.options, r = t.size;
            t.ghost = t.originalElement.clone();
            t.ghost.css({
                opacity: .25,
                display: "block",
                position: "relative",
                height: r.height,
                width: r.width,
                margin: 0,
                left: 0,
                top: 0
            }).addClass("ui-resizable-ghost").addClass("string" == typeof i.ghost ? i.ghost : "");
            t.ghost.appendTo(t.helper)
        }, resize: function () {
            var t = n(this).resizable("instance");
            t.ghost && t.ghost.css({ position: "relative", height: t.size.height, width: t.size.width })
        }, stop: function () {
            var t = n(this).resizable("instance");
            t.ghost && t.helper && t.helper.get(0).removeChild(t.ghost.get(0))
        }
    });
    n.ui.plugin.add("resizable", "grid", {
        resize: function () {
            var h, t = n(this).resizable("instance"), i = t.options, y = t.size, o = t.originalSize,
                s = t.originalPosition, c = t.axis, l = "number" == typeof i.grid ? [i.grid, i.grid] : i.grid,
                f = l[0] || 1, e = l[1] || 1, a = Math.round((y.width - o.width) / f) * f,
                v = Math.round((y.height - o.height) / e) * e, r = o.width + a, u = o.height + v,
                p = i.maxWidth && r > i.maxWidth, w = i.maxHeight && u > i.maxHeight, b = i.minWidth && i.minWidth > r,
                k = i.minHeight && i.minHeight > u;
            i.grid = l;
            b && (r += f);
            k && (u += e);
            p && (r -= f);
            w && (u -= e);
            /^(se|s|e)$/.test(c) ? (t.size.width = r, t.size.height = u) : /^(ne)$/.test(c) ? (t.size.width = r, t.size.height = u, t.position.top = s.top - v) : /^(sw)$/.test(c) ? (t.size.width = r, t.size.height = u, t.position.left = s.left - a) : ((0 >= u - e || 0 >= r - f) && (h = t._getPaddingPlusBorderDimensions(this)), u - e > 0 ? (t.size.height = u, t.position.top = s.top - v) : (u = e - h.height, t.size.height = u, t.position.top = s.top + o.height - u), r - f > 0 ? (t.size.width = r, t.position.left = s.left - a) : (r = f - h.width, t.size.width = r, t.position.left = s.left + o.width - r))
        }
    });
    n.ui.resizable;
    n.widget("ui.dialog", {
        version: "1.11.4",
        options: {
            appendTo: "body",
            autoOpen: !0,
            buttons: [],
            closeOnEscape: !0,
            closeText: "Close",
            dialogClass: "",
            draggable: !0,
            hide: null,
            height: "auto",
            maxHeight: null,
            maxWidth: null,
            minHeight: 150,
            minWidth: 150,
            modal: !1,
            position: {
                my: "center", at: "center", of: window, collision: "fit", using: function (t) {
                    var i = n(this).css(t).offset().top;
                    0 > i && n(this).css("top", t.top - i)
                }
            },
            resizable: !0,
            show: null,
            title: null,
            width: 300,
            beforeClose: null,
            close: null,
            drag: null,
            dragStart: null,
            dragStop: null,
            focus: null,
            open: null,
            resize: null,
            resizeStart: null,
            resizeStop: null
        },
        sizeRelatedOptions: {
            buttons: !0,
            height: !0,
            maxHeight: !0,
            maxWidth: !0,
            minHeight: !0,
            minWidth: !0,
            width: !0
        },
        resizableRelatedOptions: { maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0 },
        _create: function () {
            this.originalCss = {
                display: this.element[0].style.display,
                width: this.element[0].style.width,
                minHeight: this.element[0].style.minHeight,
                maxHeight: this.element[0].style.maxHeight,
                height: this.element[0].style.height
            };
            this.originalPosition = {
                parent: this.element.parent(),
                index: this.element.parent().children().index(this.element)
            };
            this.originalTitle = this.element.attr("title");
            this.options.title = this.options.title || this.originalTitle;
            this._createWrapper();
            this.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(this.uiDialog);
            this._createTitlebar();
            this._createButtonPane();
            this.options.draggable && n.fn.draggable && this._makeDraggable();
            this.options.resizable && n.fn.resizable && this._makeResizable();
            this._isOpen = !1;
            this._trackFocus()
        },
        _init: function () {
            this.options.autoOpen && this.open()
        },
        _appendTo: function () {
            var t = this.options.appendTo;
            return t && (t.jquery || t.nodeType) ? n(t) : this.document.find(t || "body").eq(0)
        },
        _destroy: function () {
            var n, t = this.originalPosition;
            this._untrackInstance();
            this._destroyOverlay();
            this.element.removeUniqueId().removeClass("ui-dialog-content ui-widget-content").css(this.originalCss).detach();
            this.uiDialog.stop(!0, !0).remove();
            this.originalTitle && this.element.attr("title", this.originalTitle);
            n = t.parent.children().eq(t.index);
            n.length && n[0] !== this.element[0] ? n.before(this.element) : t.parent.append(this.element)
        },
        widget: function () {
            return this.uiDialog
        },
        disable: n.noop,
        enable: n.noop,
        close: function (t) {
            var i, r = this;
            if (this._isOpen && this._trigger("beforeClose", t) !== !1) {
                if (this._isOpen = !1, this._focusedElement = null, this._destroyOverlay(), this._untrackInstance(), !this.opener.filter(":focusable").focus().length) try {
                    i = this.document[0].activeElement;
                    i && "body" !== i.nodeName.toLowerCase() && n(i).blur()
                } catch (u) {
                }
                this._hide(this.uiDialog, this.options.hide, function () {
                    r._trigger("close", t)
                })
            }
        },
        isOpen: function () {
            return this._isOpen
        },
        moveToTop: function () {
            this._moveToTop()
        },
        _moveToTop: function (t, i) {
            var r = !1, f = this.uiDialog.siblings(".ui-front:visible").map(function () {
                return +n(this).css("z-index")
            }).get(), u = Math.max.apply(null, f);
            return u >= +this.uiDialog.css("z-index") && (this.uiDialog.css("z-index", u + 1), r = !0), r && !i && this._trigger("focus", t), r
        },
        open: function () {
            var t = this;
            return this._isOpen ? (this._moveToTop() && this._focusTabbable(), void 0) : (this._isOpen = !0, this.opener = n(this.document[0].activeElement), this._size(), this._position(), this._createOverlay(), this._moveToTop(null, !0), this.overlay && this.overlay.css("z-index", this.uiDialog.css("z-index") - 1), this._show(this.uiDialog, this.options.show, function () {
                t._focusTabbable();
                t._trigger("focus")
            }), this._makeFocusTarget(), this._trigger("open"), void 0)
        },
        _focusTabbable: function () {
            var n = this._focusedElement;
            n || (n = this.element.find("[autofocus]"));
            n.length || (n = this.element.find(":tabbable"));
            n.length || (n = this.uiDialogButtonPane.find(":tabbable"));
            n.length || (n = this.uiDialogTitlebarClose.filter(":tabbable"));
            n.length || (n = this.uiDialog);
            n.eq(0).focus()
        },
        _keepFocus: function (t) {
            function i() {
                var t = this.document[0].activeElement, i = this.uiDialog[0] === t || n.contains(this.uiDialog[0], t);
                i || this._focusTabbable()
            }

            t.preventDefault();
            i.call(this);
            this._delay(i)
        },
        _createWrapper: function () {
            this.uiDialog = n("<div>").addClass("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front " + this.options.dialogClass).hide().attr({
                tabIndex: -1,
                role: "dialog"
            }).appendTo(this._appendTo());
            this._on(this.uiDialog, {
                keydown: function (t) {
                    if (this.options.closeOnEscape && !t.isDefaultPrevented() && t.keyCode && t.keyCode === n.ui.keyCode.ESCAPE) return t.preventDefault(), this.close(t), void 0;
                    if (t.keyCode === n.ui.keyCode.TAB && !t.isDefaultPrevented()) {
                        var i = this.uiDialog.find(":tabbable"), r = i.filter(":first"), u = i.filter(":last");
                        t.target !== u[0] && t.target !== this.uiDialog[0] || t.shiftKey ? t.target !== r[0] && t.target !== this.uiDialog[0] || !t.shiftKey || (this._delay(function () {
                            u.focus()
                        }), t.preventDefault()) : (this._delay(function () {
                            r.focus()
                        }), t.preventDefault())
                    }
                }, mousedown: function (n) {
                    this._moveToTop(n) && this._focusTabbable()
                }
            });
            this.element.find("[aria-describedby]").length || this.uiDialog.attr({ "aria-describedby": this.element.uniqueId().attr("id") })
        },
        _createTitlebar: function () {
            var t;
            this.uiDialogTitlebar = n("<div>").addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(this.uiDialog);
            this._on(this.uiDialogTitlebar, {
                mousedown: function (t) {
                    n(t.target).closest(".ui-dialog-titlebar-close") || this.uiDialog.focus()
                }
            });
            this.uiDialogTitlebarClose = n("<button type='button'><\/button>").button({
                label: this.options.closeText,
                icons: { primary: "ui-icon-closethick" },
                text: !1
            }).addClass("ui-dialog-titlebar-close").appendTo(this.uiDialogTitlebar);
            this._on(this.uiDialogTitlebarClose, {
                click: function (n) {
                    n.preventDefault();
                    this.close(n)
                }
            });
            t = n("<span>").uniqueId().addClass("ui-dialog-title").prependTo(this.uiDialogTitlebar);
            this._title(t);
            this.uiDialog.attr({ "aria-labelledby": t.attr("id") })
        },
        _title: function (n) {
            this.options.title || n.html("&#160;");
            n.text(this.options.title)
        },
        _createButtonPane: function () {
            this.uiDialogButtonPane = n("<div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix");
            this.uiButtonSet = n("<div>").addClass("ui-dialog-buttonset").appendTo(this.uiDialogButtonPane);
            this._createButtons()
        },
        _createButtons: function () {
            var i = this, t = this.options.buttons;
            return this.uiDialogButtonPane.remove(), this.uiButtonSet.empty(), n.isEmptyObject(t) || n.isArray(t) && !t.length ? (this.uiDialog.removeClass("ui-dialog-buttons"), void 0) : (n.each(t, function (t, r) {
                var u, f;
                r = n.isFunction(r) ? { click: r, text: t } : r;
                r = n.extend({ type: "button" }, r);
                u = r.click;
                r.click = function () {
                    u.apply(i.element[0], arguments)
                };
                f = { icons: r.icons, text: r.showText };
                delete r.icons;
                delete r.showText;
                n("<button><\/button>", r).button(f).appendTo(i.uiButtonSet)
            }), this.uiDialog.addClass("ui-dialog-buttons"), this.uiDialogButtonPane.appendTo(this.uiDialog), void 0)
        },
        _makeDraggable: function () {
            function i(n) {
                return { position: n.position, offset: n.offset }
            }

            var t = this, r = this.options;
            this.uiDialog.draggable({
                cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
                handle: ".ui-dialog-titlebar",
                containment: "document",
                start: function (r, u) {
                    n(this).addClass("ui-dialog-dragging");
                    t._blockFrames();
                    t._trigger("dragStart", r, i(u))
                },
                drag: function (n, r) {
                    t._trigger("drag", n, i(r))
                },
                stop: function (u, f) {
                    var e = f.offset.left - t.document.scrollLeft(), o = f.offset.top - t.document.scrollTop();
                    r.position = {
                        my: "left top",
                        at: "left" + (e >= 0 ? "+" : "") + e + " top" + (o >= 0 ? "+" : "") + o,
                        of: t.window
                    };
                    n(this).removeClass("ui-dialog-dragging");
                    t._unblockFrames();
                    t._trigger("dragStop", u, i(f))
                }
            })
        },
        _makeResizable: function () {
            function r(n) {
                return {
                    originalPosition: n.originalPosition,
                    originalSize: n.originalSize,
                    position: n.position,
                    size: n.size
                }
            }

            var t = this, i = this.options, u = i.resizable, f = this.uiDialog.css("position"),
                e = "string" == typeof u ? u : "n,e,s,w,se,sw,ne,nw";
            this.uiDialog.resizable({
                cancel: ".ui-dialog-content",
                containment: "document",
                alsoResize: this.element,
                maxWidth: i.maxWidth,
                maxHeight: i.maxHeight,
                minWidth: i.minWidth,
                minHeight: this._minHeight(),
                handles: e,
                start: function (i, u) {
                    n(this).addClass("ui-dialog-resizing");
                    t._blockFrames();
                    t._trigger("resizeStart", i, r(u))
                },
                resize: function (n, i) {
                    t._trigger("resize", n, r(i))
                },
                stop: function (u, f) {
                    var e = t.uiDialog.offset(), o = e.left - t.document.scrollLeft(),
                        s = e.top - t.document.scrollTop();
                    i.height = t.uiDialog.height();
                    i.width = t.uiDialog.width();
                    i.position = {
                        my: "left top",
                        at: "left" + (o >= 0 ? "+" : "") + o + " top" + (s >= 0 ? "+" : "") + s,
                        of: t.window
                    };
                    n(this).removeClass("ui-dialog-resizing");
                    t._unblockFrames();
                    t._trigger("resizeStop", u, r(f))
                }
            }).css("position", f)
        },
        _trackFocus: function () {
            this._on(this.widget(), {
                focusin: function (t) {
                    this._makeFocusTarget();
                    this._focusedElement = n(t.target)
                }
            })
        },
        _makeFocusTarget: function () {
            this._untrackInstance();
            this._trackingInstances().unshift(this)
        },
        _untrackInstance: function () {
            var t = this._trackingInstances(), i = n.inArray(this, t);
            -1 !== i && t.splice(i, 1)
        },
        _trackingInstances: function () {
            var n = this.document.data("ui-dialog-instances");
            return n || (n = [], this.document.data("ui-dialog-instances", n)), n
        },
        _minHeight: function () {
            var n = this.options;
            return "auto" === n.height ? n.minHeight : Math.min(n.minHeight, n.height)
        },
        _position: function () {
            var n = this.uiDialog.is(":visible");
            n || this.uiDialog.show();
            this.uiDialog.position(this.options.position);
            n || this.uiDialog.hide()
        },
        _setOptions: function (t) {
            var i = this, r = !1, u = {};
            n.each(t, function (n, t) {
                i._setOption(n, t);
                n in i.sizeRelatedOptions && (r = !0);
                n in i.resizableRelatedOptions && (u[n] = t)
            });
            r && (this._size(), this._position());
            this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", u)
        },
        _setOption: function (n, t) {
            var u, r, i = this.uiDialog;
            "dialogClass" === n && i.removeClass(this.options.dialogClass).addClass(t);
            "disabled" !== n && (this._super(n, t), "appendTo" === n && this.uiDialog.appendTo(this._appendTo()), "buttons" === n && this._createButtons(), "closeText" === n && this.uiDialogTitlebarClose.button({ label: "" + t }), "draggable" === n && (u = i.is(":data(ui-draggable)"), u && !t && i.draggable("destroy"), !u && t && this._makeDraggable()), "position" === n && this._position(), "resizable" === n && (r = i.is(":data(ui-resizable)"), r && !t && i.resizable("destroy"), r && "string" == typeof t && i.resizable("option", "handles", t), r || t === !1 || this._makeResizable()), "title" === n && this._title(this.uiDialogTitlebar.find(".ui-dialog-title")))
        },
        _size: function () {
            var t, i, r, n = this.options;
            this.element.show().css({ width: "auto", minHeight: 0, maxHeight: "none", height: 0 });
            n.minWidth > n.width && (n.width = n.minWidth);
            t = this.uiDialog.css({ height: "auto", width: n.width }).outerHeight();
            i = Math.max(0, n.minHeight - t);
            r = "number" == typeof n.maxHeight ? Math.max(0, n.maxHeight - t) : "none";
            "auto" === n.height ? this.element.css({
                minHeight: i,
                maxHeight: r,
                height: "auto"
            }) : this.element.height(Math.max(0, n.height - t));
            this.uiDialog.is(":data(ui-resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
        },
        _blockFrames: function () {
            this.iframeBlocks = this.document.find("iframe").map(function () {
                var t = n(this);
                return n("<div>").css({
                    position: "absolute",
                    width: t.outerWidth(),
                    height: t.outerHeight()
                }).appendTo(t.parent()).offset(t.offset())[0]
            })
        },
        _unblockFrames: function () {
            this.iframeBlocks && (this.iframeBlocks.remove(), delete this.iframeBlocks)
        },
        _allowInteraction: function (t) {
            return n(t.target).closest(".ui-dialog").length ? !0 : !!n(t.target).closest(".ui-datepicker").length
        },
        _createOverlay: function () {
            if (this.options.modal) {
                var t = !0;
                this._delay(function () {
                    t = !1
                });
                this.document.data("ui-dialog-overlays") || this._on(this.document, {
                    focusin: function (n) {
                        t || this._allowInteraction(n) || (n.preventDefault(), this._trackingInstances()[0]._focusTabbable())
                    }
                });
                this.overlay = n("<div>").addClass("ui-widget-overlay ui-front").appendTo(this._appendTo());
                this._on(this.overlay, { mousedown: "_keepFocus" });
                this.document.data("ui-dialog-overlays", (this.document.data("ui-dialog-overlays") || 0) + 1)
            }
        },
        _destroyOverlay: function () {
            if (this.options.modal && this.overlay) {
                var n = this.document.data("ui-dialog-overlays") - 1;
                n ? this.document.data("ui-dialog-overlays", n) : this.document.unbind("focusin").removeData("ui-dialog-overlays");
                this.overlay.remove();
                this.overlay = null
            }
        }
    });
    n.widget("ui.droppable", {
        version: "1.11.4",
        widgetEventPrefix: "drop",
        options: {
            accept: "*",
            activeClass: !1,
            addClasses: !0,
            greedy: !1,
            hoverClass: !1,
            scope: "default",
            tolerance: "intersect",
            activate: null,
            deactivate: null,
            drop: null,
            out: null,
            over: null
        },
        _create: function () {
            var t, i = this.options, r = i.accept;
            this.isover = !1;
            this.isout = !0;
            this.accept = n.isFunction(r) ? r : function (n) {
                return n.is(r)
            };
            this.proportions = function () {
                return arguments.length ? (t = arguments[0], void 0) : t ? t : t = {
                    width: this.element[0].offsetWidth,
                    height: this.element[0].offsetHeight
                }
            };
            this._addToManager(i.scope);
            i.addClasses && this.element.addClass("ui-droppable")
        },
        _addToManager: function (t) {
            n.ui.ddmanager.droppables[t] = n.ui.ddmanager.droppables[t] || [];
            n.ui.ddmanager.droppables[t].push(this)
        },
        _splice: function (n) {
            for (var t = 0; n.length > t; t++) n[t] === this && n.splice(t, 1)
        },
        _destroy: function () {
            var t = n.ui.ddmanager.droppables[this.options.scope];
            this._splice(t);
            this.element.removeClass("ui-droppable ui-droppable-disabled")
        },
        _setOption: function (t, i) {
            if ("accept" === t) this.accept = n.isFunction(i) ? i : function (n) {
                return n.is(i)
            }; else if ("scope" === t) {
                var r = n.ui.ddmanager.droppables[this.options.scope];
                this._splice(r);
                this._addToManager(i)
            }
            this._super(t, i)
        },
        _activate: function (t) {
            var i = n.ui.ddmanager.current;
            this.options.activeClass && this.element.addClass(this.options.activeClass);
            i && this._trigger("activate", t, this.ui(i))
        },
        _deactivate: function (t) {
            var i = n.ui.ddmanager.current;
            this.options.activeClass && this.element.removeClass(this.options.activeClass);
            i && this._trigger("deactivate", t, this.ui(i))
        },
        _over: function (t) {
            var i = n.ui.ddmanager.current;
            i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", t, this.ui(i)))
        },
        _out: function (t) {
            var i = n.ui.ddmanager.current;
            i && (i.currentItem || i.element)[0] !== this.element[0] && this.accept.call(this.element[0], i.currentItem || i.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", t, this.ui(i)))
        },
        _drop: function (t, i) {
            var r = i || n.ui.ddmanager.current, u = !1;
            return r && (r.currentItem || r.element)[0] !== this.element[0] ? (this.element.find(":data(ui-droppable)").not(".ui-draggable-dragging").each(function () {
                var i = n(this).droppable("instance");
                if (i.options.greedy && !i.options.disabled && i.options.scope === r.options.scope && i.accept.call(i.element[0], r.currentItem || r.element) && n.ui.intersect(r, n.extend(i, { offset: i.element.offset() }), i.options.tolerance, t)) return (u = !0, !1)
            }), u ? !1 : this.accept.call(this.element[0], r.currentItem || r.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", t, this.ui(r)), this.element) : !1) : !1
        },
        ui: function (n) {
            return {
                draggable: n.currentItem || n.element,
                helper: n.helper,
                position: n.position,
                offset: n.positionAbs
            }
        }
    });
    n.ui.intersect = function () {
        function n(n, t, i) {
            return n >= t && t + i > n
        }

        return function (t, i, r, u) {
            if (!i.offset) return !1;
            var o = (t.positionAbs || t.position.absolute).left + t.margins.left,
                s = (t.positionAbs || t.position.absolute).top + t.margins.top, h = o + t.helperProportions.width,
                c = s + t.helperProportions.height, f = i.offset.left, e = i.offset.top, l = f + i.proportions().width,
                a = e + i.proportions().height;
            switch (r) {
                case "fit":
                    return o >= f && l >= h && s >= e && a >= c;
                case "intersect":
                    return o + t.helperProportions.width / 2 > f && l > h - t.helperProportions.width / 2 && s + t.helperProportions.height / 2 > e && a > c - t.helperProportions.height / 2;
                case "pointer":
                    return n(u.pageY, e, i.proportions().height) && n(u.pageX, f, i.proportions().width);
                case "touch":
                    return (s >= e && a >= s || c >= e && a >= c || e > s && c > a) && (o >= f && l >= o || h >= f && l >= h || f > o && h > l);
                default:
                    return !1
            }
        }
    }();
    n.ui.ddmanager = {
        current: null, droppables: { "default": [] }, prepareOffsets: function (t, i) {
            var r, f, u = n.ui.ddmanager.droppables[t.options.scope] || [], o = i ? i.type : null,
                e = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();
            n: for (r = 0; u.length > r; r++) if (!(u[r].options.disabled || t && !u[r].accept.call(u[r].element[0], t.currentItem || t.element))) {
                for (f = 0; e.length > f; f++) if (e[f] === u[r].element[0]) {
                    u[r].proportions().height = 0;
                    continue n
                }
                u[r].visible = "none" !== u[r].element.css("display");
                u[r].visible && ("mousedown" === o && u[r]._activate.call(u[r], i), u[r].offset = u[r].element.offset(), u[r].proportions({
                    width: u[r].element[0].offsetWidth,
                    height: u[r].element[0].offsetHeight
                }))
            }
        }, drop: function (t, i) {
            var r = !1;
            return n.each((n.ui.ddmanager.droppables[t.options.scope] || []).slice(), function () {
                this.options && (!this.options.disabled && this.visible && n.ui.intersect(t, this, this.options.tolerance, i) && (r = this._drop.call(this, i) || r), !this.options.disabled && this.visible && this.accept.call(this.element[0], t.currentItem || t.element) && (this.isout = !0, this.isover = !1, this._deactivate.call(this, i)))
            }), r
        }, dragStart: function (t, i) {
            t.element.parentsUntil("body").bind("scroll.droppable", function () {
                t.options.refreshPositions || n.ui.ddmanager.prepareOffsets(t, i)
            })
        }, drag: function (t, i) {
            t.options.refreshPositions && n.ui.ddmanager.prepareOffsets(t, i);
            n.each(n.ui.ddmanager.droppables[t.options.scope] || [], function () {
                if (!this.options.disabled && !this.greedyChild && this.visible) {
                    var r, e, f, o = n.ui.intersect(t, this, this.options.tolerance, i),
                        u = !o && this.isover ? "isout" : o && !this.isover ? "isover" : null;
                    u && (this.options.greedy && (e = this.options.scope, f = this.element.parents(":data(ui-droppable)").filter(function () {
                        return n(this).droppable("instance").options.scope === e
                    }), f.length && (r = n(f[0]).droppable("instance"), r.greedyChild = "isover" === u)), r && "isover" === u && (r.isover = !1, r.isout = !0, r._out.call(r, i)), this[u] = !0, this["isout" === u ? "isover" : "isout"] = !1, this["isover" === u ? "_over" : "_out"].call(this, i), r && "isout" === u && (r.isout = !1, r.isover = !0, r._over.call(r, i)))
                }
            })
        }, dragStop: function (t, i) {
            t.element.parentsUntil("body").unbind("scroll.droppable");
            t.options.refreshPositions || n.ui.ddmanager.prepareOffsets(t, i)
        }
    };
    n.ui.droppable;
    o = "ui-effects-";
    s = n;
    n.effects = { effect: {} }, function (n, t) {
        function f(n, t, i) {
            var r = h[t.type] || {};
            return null == n ? i || !t.def ? null : t.def : (n = r.floor ? ~~n : parseFloat(n), isNaN(n) ? t.def : r.mod ? (n + r.mod) % r.mod : 0 > n ? 0 : n > r.max ? r.max : n)
        }

        function s(f) {
            var o = i(), s = o._rgba = [];
            return f = f.toLowerCase(), r(v, function (n, i) {
                var r, h = i.re.exec(f), c = h && i.parse(h), e = i.space || "rgba";
                return c ? (r = o[e](c), o[u[e].cache] = r[u[e].cache], s = o._rgba = r._rgba, !1) : t
            }), s.length ? ("0,0,0,0" === s.join() && n.extend(s, e.transparent), o) : e[f]
        }

        function o(n, t, i) {
            return i = (i + 1) % 1, 1 > 6 * i ? n + 6 * (t - n) * i : 1 > 2 * i ? t : 2 > 3 * i ? n + 6 * (t - n) * (2 / 3 - i) : n
        }

        var e, a = /^([\-+])=\s*(\d+\.?\d*)/, v = [{
            re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function (n) {
                return [n[1], n[2], n[3], n[4]]
            }
        }, {
            re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            parse: function (n) {
                return [2.55 * n[1], 2.55 * n[2], 2.55 * n[3], n[4]]
            }
        }, {
            re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/, parse: function (n) {
                return [parseInt(n[1], 16), parseInt(n[2], 16), parseInt(n[3], 16)]
            }
        }, {
            re: /#([a-f0-9])([a-f0-9])([a-f0-9])/, parse: function (n) {
                return [parseInt(n[1] + n[1], 16), parseInt(n[2] + n[2], 16), parseInt(n[3] + n[3], 16)]
            }
        }, {
            re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
            space: "hsla",
            parse: function (n) {
                return [n[1], n[2] / 100, n[3] / 100, n[4]]
            }
        }], i = n.Color = function (t, i, r, u) {
            return new n.Color.fn.parse(t, i, r, u)
        }, u = {
            rgba: {
                props: {
                    red: { idx: 0, type: "byte" },
                    green: { idx: 1, type: "byte" },
                    blue: { idx: 2, type: "byte" }
                }
            },
            hsla: {
                props: {
                    hue: { idx: 0, type: "degrees" },
                    saturation: { idx: 1, type: "percent" },
                    lightness: { idx: 2, type: "percent" }
                }
            }
        }, h = { byte: { floor: !0, max: 255 }, percent: { max: 1 }, degrees: { mod: 360, floor: !0 } }, c = i.support = {},
            l = n("<p>")[0], r = n.each;
        l.style.cssText = "background-color:rgba(1,1,1,.5)";
        c.rgba = l.style.backgroundColor.indexOf("rgba") > -1;
        r(u, function (n, t) {
            t.cache = "_" + n;
            t.props.alpha = { idx: 3, type: "percent", def: 1 }
        });
        i.fn = n.extend(i.prototype, {
            parse: function (o, h, c, l) {
                if (o === t) return this._rgba = [null, null, null, null], this;
                (o.jquery || o.nodeType) && (o = n(o).css(h), h = t);
                var a = this, v = n.type(o), y = this._rgba = [];
                return h !== t && (o = [o, h, c, l], v = "array"), "string" === v ? this.parse(s(o) || e._default) : "array" === v ? (r(u.rgba.props, function (n, t) {
                    y[t.idx] = f(o[t.idx], t)
                }), this) : "object" === v ? (o instanceof i ? r(u, function (n, t) {
                    o[t.cache] && (a[t.cache] = o[t.cache].slice())
                }) : r(u, function (t, i) {
                    var u = i.cache;
                    r(i.props, function (n, t) {
                        if (!a[u] && i.to) {
                            if ("alpha" === n || null == o[n]) return;
                            a[u] = i.to(a._rgba)
                        }
                        a[u][t.idx] = f(o[n], t, !0)
                    });
                    a[u] && 0 > n.inArray(null, a[u].slice(0, 3)) && (a[u][3] = 1, i.from && (a._rgba = i.from(a[u])))
                }), this) : t
            }, is: function (n) {
                var o = i(n), f = !0, e = this;
                return r(u, function (n, i) {
                    var s, u = o[i.cache];
                    return u && (s = e[i.cache] || i.to && i.to(e._rgba) || [], r(i.props, function (n, i) {
                        return null != u[i.idx] ? f = u[i.idx] === s[i.idx] : t
                    })), f
                }), f
            }, _space: function () {
                var n = [], t = this;
                return r(u, function (i, r) {
                    t[r.cache] && n.push(i)
                }), n.pop()
            }, transition: function (n, t) {
                var e = i(n), c = e._space(), o = u[c], l = 0 === this.alpha() ? i("transparent") : this,
                    a = l[o.cache] || o.to(l._rgba), s = a.slice();
                return e = e[o.cache], r(o.props, function (n, i) {
                    var c = i.idx, r = a[c], u = e[c], o = h[i.type] || {};
                    null !== u && (null === r ? s[c] = u : (o.mod && (u - r > o.mod / 2 ? r += o.mod : r - u > o.mod / 2 && (r -= o.mod)), s[c] = f((u - r) * t + r, i)))
                }), this[c](s)
            }, blend: function (t) {
                if (1 === this._rgba[3]) return this;
                var r = this._rgba.slice(), u = r.pop(), f = i(t)._rgba;
                return i(n.map(r, function (n, t) {
                    return (1 - u) * f[t] + u * n
                }))
            }, toRgbaString: function () {
                var i = "rgba(", t = n.map(this._rgba, function (n, t) {
                    return null == n ? t > 2 ? 1 : 0 : n
                });
                return 1 === t[3] && (t.pop(), i = "rgb("), i + t.join() + ")"
            }, toHslaString: function () {
                var i = "hsla(", t = n.map(this.hsla(), function (n, t) {
                    return null == n && (n = t > 2 ? 1 : 0), t && 3 > t && (n = Math.round(100 * n) + "%"), n
                });
                return 1 === t[3] && (t.pop(), i = "hsl("), i + t.join() + ")"
            }, toHexString: function (t) {
                var i = this._rgba.slice(), r = i.pop();
                return t && i.push(~~(255 * r)), "#" + n.map(i, function (n) {
                    return n = (n || 0).toString(16), 1 === n.length ? "0" + n : n
                }).join("")
            }, toString: function () {
                return 0 === this._rgba[3] ? "transparent" : this.toRgbaString()
            }
        });
        i.fn.parse.prototype = i.fn;
        u.hsla.to = function (n) {
            if (null == n[0] || null == n[1] || null == n[2]) return [null, null, null, n[3]];
            var s, h, i = n[0] / 255, r = n[1] / 255, f = n[2] / 255, c = n[3], u = Math.max(i, r, f),
                e = Math.min(i, r, f), t = u - e, o = u + e, l = .5 * o;
            return s = e === u ? 0 : i === u ? 60 * (r - f) / t + 360 : r === u ? 60 * (f - i) / t + 120 : 60 * (i - r) / t + 240, h = 0 === t ? 0 : .5 >= l ? t / o : t / (2 - o), [Math.round(s) % 360, h, l, null == c ? 1 : c]
        };
        u.hsla.from = function (n) {
            if (null == n[0] || null == n[1] || null == n[2]) return [null, null, null, n[3]];
            var r = n[0] / 360, u = n[1], t = n[2], e = n[3], i = .5 >= t ? t * (1 + u) : t + u - t * u, f = 2 * t - i;
            return [Math.round(255 * o(f, i, r + 1 / 3)), Math.round(255 * o(f, i, r)), Math.round(255 * o(f, i, r - 1 / 3)), e]
        };
        r(u, function (u, e) {
            var s = e.props, o = e.cache, h = e.to, c = e.from;
            i.fn[u] = function (u) {
                if (h && !this[o] && (this[o] = h(this._rgba)), u === t) return this[o].slice();
                var l, a = n.type(u), v = "array" === a || "object" === a ? u : arguments, e = this[o].slice();
                return r(s, function (n, t) {
                    var i = v["object" === a ? n : t.idx];
                    null == i && (i = e[t.idx]);
                    e[t.idx] = f(i, t)
                }), c ? (l = i(c(e)), l[o] = e, l) : i(e)
            };
            r(s, function (t, r) {
                i.fn[t] || (i.fn[t] = function (i) {
                    var f, e = n.type(i), h = "alpha" === t ? this._hsla ? "hsla" : "rgba" : u, o = this[h](),
                        s = o[r.idx];
                    return "undefined" === e ? s : ("function" === e && (i = i.call(this, s), e = n.type(i)), null == i && r.empty ? this : ("string" === e && (f = a.exec(i), f && (i = s + parseFloat(f[2]) * ("+" === f[1] ? 1 : -1))), o[r.idx] = i, this[h](o)))
                })
            })
        });
        i.hook = function (t) {
            var u = t.split(" ");
            r(u, function (t, r) {
                n.cssHooks[r] = {
                    set: function (t, u) {
                        var o, f, e = "";
                        if ("transparent" !== u && ("string" !== n.type(u) || (o = s(u)))) {
                            if (u = i(o || u), !c.rgba && 1 !== u._rgba[3]) {
                                for (f = "backgroundColor" === r ? t.parentNode : t; ("" === e || "transparent" === e) && f && f.style;) try {
                                    e = n.css(f, "backgroundColor");
                                    f = f.parentNode
                                } catch (h) {
                                }
                                u = u.blend(e && "transparent" !== e ? e : "_default")
                            }
                            u = u.toRgbaString()
                        }
                        try {
                            t.style[r] = u
                        } catch (h) {
                        }
                    }
                };
                n.fx.step[r] = function (t) {
                    t.colorInit || (t.start = i(t.elem, r), t.end = i(t.end), t.colorInit = !0);
                    n.cssHooks[r].set(t.elem, t.start.transition(t.end, t.pos))
                }
            })
        };
        i.hook("backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor");
        n.cssHooks.borderColor = {
            expand: function (n) {
                var t = {};
                return r(["Top", "Right", "Bottom", "Left"], function (i, r) {
                    t["border" + r + "Color"] = n
                }), t
            }
        };
        e = n.Color.names = {
            aqua: "#00ffff",
            black: "#000000",
            blue: "#0000ff",
            fuchsia: "#ff00ff",
            gray: "#808080",
            green: "#008000",
            lime: "#00ff00",
            maroon: "#800000",
            navy: "#000080",
            olive: "#808000",
            purple: "#800080",
            red: "#ff0000",
            silver: "#c0c0c0",
            teal: "#008080",
            white: "#ffffff",
            yellow: "#ffff00",
            transparent: [null, null, null, 0],
            _default: "#ffffff"
        }
    }(s), function () {
        function t(t) {
            var r, u,
                i = t.ownerDocument.defaultView ? t.ownerDocument.defaultView.getComputedStyle(t, null) : t.currentStyle,
                f = {};
            if (i && i.length && i[0] && i[i[0]]) for (u = i.length; u--;) r = i[u], "string" == typeof i[r] && (f[n.camelCase(r)] = i[r]); else for (r in i) "string" == typeof i[r] && (f[r] = i[r]);
            return f
        }

        function i(t, i) {
            var r, f, e = {};
            for (r in i) f = i[r], t[r] !== f && (u[r] || (n.fx.step[r] || !isNaN(parseFloat(f))) && (e[r] = f));
            return e
        }

        var r = ["add", "remove", "toggle"], u = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
        n.each(["borderLeftStyle", "borderRightStyle", "borderBottomStyle", "borderTopStyle"], function (t, i) {
            n.fx.step[i] = function (n) {
                ("none" === n.end || n.setAttr) && (1 !== n.pos || n.setAttr) || (s.style(n.elem, i, n.end), n.setAttr = !0)
            }
        });
        n.fn.addBack || (n.fn.addBack = function (n) {
            return this.add(null == n ? this.prevObject : this.prevObject.filter(n))
        });
        n.effects.animateClass = function (u, f, e, o) {
            var s = n.speed(f, e, o);
            return this.queue(function () {
                var o, e = n(this), h = e.attr("class") || "", f = s.children ? e.find("*").addBack() : e;
                f = f.map(function () {
                    var i = n(this);
                    return { el: i, start: t(this) }
                });
                o = function () {
                    n.each(r, function (n, t) {
                        u[t] && e[t + "Class"](u[t])
                    })
                };
                o();
                f = f.map(function () {
                    return this.end = t(this.el[0]), this.diff = i(this.start, this.end), this
                });
                e.attr("class", h);
                f = f.map(function () {
                    var i = this, t = n.Deferred(), r = n.extend({}, s, {
                        queue: !1, complete: function () {
                            t.resolve(i)
                        }
                    });
                    return this.el.animate(this.diff, r), t.promise()
                });
                n.when.apply(n, f.get()).done(function () {
                    o();
                    n.each(arguments, function () {
                        var t = this.el;
                        n.each(this.diff, function (n) {
                            t.css(n, "")
                        })
                    });
                    s.complete.call(e[0])
                })
            })
        };
        n.fn.extend({
            addClass: function (t) {
                return function (i, r, u, f) {
                    return r ? n.effects.animateClass.call(this, { add: i }, r, u, f) : t.apply(this, arguments)
                }
            }(n.fn.addClass), removeClass: function (t) {
                return function (i, r, u, f) {
                    return arguments.length > 1 ? n.effects.animateClass.call(this, { remove: i }, r, u, f) : t.apply(this, arguments)
                }
            }(n.fn.removeClass), toggleClass: function (t) {
                return function (i, r, u, f, e) {
                    return "boolean" == typeof r || void 0 === r ? u ? n.effects.animateClass.call(this, r ? { add: i } : { remove: i }, u, f, e) : t.apply(this, arguments) : n.effects.animateClass.call(this, { toggle: i }, r, u, f)
                }
            }(n.fn.toggleClass), switchClass: function (t, i, r, u, f) {
                return n.effects.animateClass.call(this, { add: i, remove: t }, r, u, f)
            }
        })
    }(), function () {
        function t(t, i, r, u) {
            return n.isPlainObject(t) && (i = t, t = t.effect), t = { effect: t }, null == i && (i = {}), n.isFunction(i) && (u = i, r = null, i = {}), ("number" == typeof i || n.fx.speeds[i]) && (u = r, r = i, i = {}), n.isFunction(r) && (u = r, r = null), i && n.extend(t, i), r = r || i.duration, t.duration = n.fx.off ? 0 : "number" == typeof r ? r : r in n.fx.speeds ? n.fx.speeds[r] : n.fx.speeds._default, t.complete = u || i.complete, t
        }

        function i(t) {
            return !t || "number" == typeof t || n.fx.speeds[t] ? !0 : "string" != typeof t || n.effects.effect[t] ? n.isFunction(t) ? !0 : "object" != typeof t || t.effect ? !1 : !0 : !0
        }

        n.extend(n.effects, {
            version: "1.11.4", save: function (n, t) {
                for (var i = 0; t.length > i; i++) null !== t[i] && n.data(o + t[i], n[0].style[t[i]])
            }, restore: function (n, t) {
                for (var r, i = 0; t.length > i; i++) null !== t[i] && (r = n.data(o + t[i]), void 0 === r && (r = ""), n.css(t[i], r))
            }, setMode: function (n, t) {
                return "toggle" === t && (t = n.is(":hidden") ? "show" : "hide"), t
            }, getBaseline: function (n, t) {
                var i, r;
                switch (n[0]) {
                    case "top":
                        i = 0;
                        break;
                    case "middle":
                        i = .5;
                        break;
                    case "bottom":
                        i = 1;
                        break;
                    default:
                        i = n[0] / t.height
                }
                switch (n[1]) {
                    case "left":
                        r = 0;
                        break;
                    case "center":
                        r = .5;
                        break;
                    case "right":
                        r = 1;
                        break;
                    default:
                        r = n[1] / t.width
                }
                return { x: r, y: i }
            }, createWrapper: function (t) {
                if (t.parent().is(".ui-effects-wrapper")) return t.parent();
                var i = { width: t.outerWidth(!0), height: t.outerHeight(!0), float: t.css("float") },
                    u = n("<div><\/div>").addClass("ui-effects-wrapper").css({
                        fontSize: "100%",
                        background: "transparent",
                        border: "none",
                        margin: 0,
                        padding: 0
                    }), f = { width: t.width(), height: t.height() }, r = document.activeElement;
                try {
                    r.id
                } catch (e) {
                    r = document.body
                }
                return t.wrap(u), (t[0] === r || n.contains(t[0], r)) && n(r).focus(), u = t.parent(), "static" === t.css("position") ? (u.css({ position: "relative" }), t.css({ position: "relative" })) : (n.extend(i, {
                    position: t.css("position"),
                    zIndex: t.css("z-index")
                }), n.each(["top", "left", "bottom", "right"], function (n, r) {
                    i[r] = t.css(r);
                    isNaN(parseInt(i[r], 10)) && (i[r] = "auto")
                }), t.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })), t.css(f), u.css(i).show()
            }, removeWrapper: function (t) {
                var i = document.activeElement;
                return t.parent().is(".ui-effects-wrapper") && (t.parent().replaceWith(t), (t[0] === i || n.contains(t[0], i)) && n(i).focus()), t
            }, setTransition: function (t, i, r, u) {
                return u = u || {}, n.each(i, function (n, i) {
                    var f = t.cssUnit(i);
                    f[0] > 0 && (u[i] = f[0] * r + f[1])
                }), u
            }
        });
        n.fn.extend({
            effect: function () {
                function r(t) {
                    function f() {
                        n.isFunction(o) && o.call(r[0]);
                        n.isFunction(t) && t()
                    }

                    var r = n(this), o = i.complete, u = i.mode;
                    (r.is(":hidden") ? "hide" === u : "show" === u) ? (r[u](), f()) : e.call(r[0], i, f)
                }

                var i = t.apply(this, arguments), u = i.mode, f = i.queue, e = n.effects.effect[i.effect];
                return n.fx.off || !e ? u ? this[u](i.duration, i.complete) : this.each(function () {
                    i.complete && i.complete.call(this)
                }) : f === !1 ? this.each(r) : this.queue(f || "fx", r)
            }, show: function (n) {
                return function (r) {
                    if (i(r)) return n.apply(this, arguments);
                    var u = t.apply(this, arguments);
                    return u.mode = "show", this.effect.call(this, u)
                }
            }(n.fn.show), hide: function (n) {
                return function (r) {
                    if (i(r)) return n.apply(this, arguments);
                    var u = t.apply(this, arguments);
                    return u.mode = "hide", this.effect.call(this, u)
                }
            }(n.fn.hide), toggle: function (n) {
                return function (r) {
                    if (i(r) || "boolean" == typeof r) return n.apply(this, arguments);
                    var u = t.apply(this, arguments);
                    return u.mode = "toggle", this.effect.call(this, u)
                }
            }(n.fn.toggle), cssUnit: function (t) {
                var i = this.css(t), r = [];
                return n.each(["em", "px", "%", "pt"], function (n, t) {
                    i.indexOf(t) > 0 && (r = [parseFloat(i), t])
                }), r
            }
        })
    }(), function () {
        var t = {};
        n.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (n, i) {
            t[i] = function (t) {
                return Math.pow(t, n + 2)
            }
        });
        n.extend(t, {
            Sine: function (n) {
                return 1 - Math.cos(n * Math.PI / 2)
            }, Circ: function (n) {
                return 1 - Math.sqrt(1 - n * n)
            }, Elastic: function (n) {
                return 0 === n || 1 === n ? n : -Math.pow(2, 8 * (n - 1)) * Math.sin((80 * (n - 1) - 7.5) * Math.PI / 15)
            }, Back: function (n) {
                return n * n * (3 * n - 2)
            }, Bounce: function (n) {
                for (var t, i = 4; ((t = Math.pow(2, --i)) - 1) / 11 > n;);
                return 1 / Math.pow(4, 3 - i) - 7.5625 * Math.pow((3 * t - 2) / 22 - n, 2)
            }
        });
        n.each(t, function (t, i) {
            n.easing["easeIn" + t] = i;
            n.easing["easeOut" + t] = function (n) {
                return 1 - i(1 - n)
            };
            n.easing["easeInOut" + t] = function (n) {
                return .5 > n ? i(2 * n) / 2 : 1 - i(-2 * n + 2) / 2
            }
        })
    }();
    n.effects;
    n.effects.effect.blind = function (t, i) {
        var u, f, e, r = n(this), s = ["position", "top", "bottom", "left", "right", "height", "width"],
            v = n.effects.setMode(r, t.mode || "hide"), y = t.direction || "up", o = /up|down|vertical/.test(y),
            h = o ? "height" : "width", c = o ? "top" : "left", p = /up|left|vertical|horizontal/.test(y), l = {},
            a = "show" === v;
        r.parent().is(".ui-effects-wrapper") ? n.effects.save(r.parent(), s) : n.effects.save(r, s);
        r.show();
        u = n.effects.createWrapper(r).css({ overflow: "hidden" });
        f = u[h]();
        e = parseFloat(u.css(c)) || 0;
        l[h] = a ? f : 0;
        p || (r.css(o ? "bottom" : "right", 0).css(o ? "top" : "left", "auto").css({ position: "absolute" }), l[c] = a ? e : f + e);
        a && (u.css(h, 0), p || u.css(c, e + f));
        u.animate(l, {
            duration: t.duration, easing: t.easing, queue: !1, complete: function () {
                "hide" === v && r.hide();
                n.effects.restore(r, s);
                n.effects.removeWrapper(r);
                i()
            }
        })
    };
    n.effects.effect.bounce = function (t, i) {
        var v, f, e, r = n(this), y = ["position", "top", "bottom", "left", "right", "height", "width"],
            k = n.effects.setMode(r, t.mode || "effect"), o = "hide" === k, p = "show" === k, h = t.direction || "up",
            u = t.distance, w = t.times || 5, d = 2 * w + (p || o ? 1 : 0), c = t.duration / d, l = t.easing,
            s = "up" === h || "down" === h ? "top" : "left", b = "up" === h || "left" === h, a = r.queue(),
            g = a.length;
        for ((p || o) && y.push("opacity"), n.effects.save(r, y), r.show(), n.effects.createWrapper(r), u || (u = r["top" === s ? "outerHeight" : "outerWidth"]() / 3), p && (e = { opacity: 1 }, e[s] = 0, r.css("opacity", 0).css(s, b ? 2 * -u : 2 * u).animate(e, c, l)), o && (u /= Math.pow(2, w - 1)), e = {}, e[s] = 0, v = 0; w > v; v++) f = {}, f[s] = (b ? "-=" : "+=") + u, r.animate(f, c, l).animate(e, c, l), u = o ? 2 * u : u / 2;
        o && (f = { opacity: 0 }, f[s] = (b ? "-=" : "+=") + u, r.animate(f, c, l));
        r.queue(function () {
            o && r.hide();
            n.effects.restore(r, y);
            n.effects.removeWrapper(r);
            i()
        });
        g > 1 && a.splice.apply(a, [1, 0].concat(a.splice(g, d + 1)));
        r.dequeue()
    };
    n.effects.effect.clip = function (t, i) {
        var h, u, f, r = n(this), c = ["position", "top", "bottom", "left", "right", "height", "width"],
            v = n.effects.setMode(r, t.mode || "hide"), e = "show" === v, y = t.direction || "vertical",
            l = "vertical" === y, o = l ? "height" : "width", a = l ? "top" : "left", s = {};
        n.effects.save(r, c);
        r.show();
        h = n.effects.createWrapper(r).css({ overflow: "hidden" });
        u = "IMG" === r[0].tagName ? h : r;
        f = u[o]();
        e && (u.css(o, 0), u.css(a, f / 2));
        s[o] = e ? f : 0;
        s[a] = e ? 0 : f / 2;
        u.animate(s, {
            queue: !1, duration: t.duration, easing: t.easing, complete: function () {
                e || r.hide();
                n.effects.restore(r, c);
                n.effects.removeWrapper(r);
                i()
            }
        })
    };
    n.effects.effect.drop = function (t, i) {
        var u, r = n(this), h = ["position", "top", "bottom", "left", "right", "opacity", "height", "width"],
            c = n.effects.setMode(r, t.mode || "hide"), e = "show" === c, f = t.direction || "left",
            o = "up" === f || "down" === f ? "top" : "left", s = "up" === f || "left" === f ? "pos" : "neg",
            l = { opacity: e ? 1 : 0 };
        n.effects.save(r, h);
        r.show();
        n.effects.createWrapper(r);
        u = t.distance || r["top" === o ? "outerHeight" : "outerWidth"](!0) / 2;
        e && r.css("opacity", 0).css(o, "pos" === s ? -u : u);
        l[o] = (e ? "pos" === s ? "+=" : "-=" : "pos" === s ? "-=" : "+=") + u;
        r.animate(l, {
            queue: !1, duration: t.duration, easing: t.easing, complete: function () {
                "hide" === c && r.hide();
                n.effects.restore(r, h);
                n.effects.removeWrapper(r);
                i()
            }
        })
    };
    n.effects.effect.explode = function (t, i) {
        function b() {
            p.push(this);
            p.length === o * c && k()
        }

        function k() {
            r.css({ visibility: "visible" });
            n(p).remove();
            u || r.hide();
            i()
        }

        for (var e, l, a, v, y, o = t.pieces ? Math.round(Math.sqrt(t.pieces)) : 3, c = o, r = n(this), d = n.effects.setMode(r, t.mode || "hide"), u = "show" === d, w = r.show().css("visibility", "hidden").offset(), s = Math.ceil(r.outerWidth() / c), h = Math.ceil(r.outerHeight() / o), p = [], f = 0; o > f; f++) for (a = w.top + f * h, y = f - (o - 1) / 2, e = 0; c > e; e++) l = w.left + e * s, v = e - (c - 1) / 2, r.clone().appendTo("body").wrap("<div><\/div>").css({
            position: "absolute",
            visibility: "visible",
            left: -e * s,
            top: -f * h
        }).parent().addClass("ui-effects-explode").css({
            position: "absolute",
            overflow: "hidden",
            width: s,
            height: h,
            left: l + (u ? v * s : 0),
            top: a + (u ? y * h : 0),
            opacity: u ? 0 : 1
        }).animate({
            left: l + (u ? 0 : v * s),
            top: a + (u ? 0 : y * h),
            opacity: u ? 1 : 0
        }, t.duration || 500, t.easing, b)
    };
    n.effects.effect.fade = function (t, i) {
        var r = n(this), u = n.effects.setMode(r, t.mode || "toggle");
        r.animate({ opacity: u }, { queue: !1, duration: t.duration, easing: t.easing, complete: i })
    };
    n.effects.effect.fold = function (t, i) {
        var r, e, u = n(this), s = ["position", "top", "bottom", "left", "right", "height", "width"],
            h = n.effects.setMode(u, t.mode || "hide"), o = "show" === h, c = "hide" === h, f = t.size || 15,
            l = /([0-9]+)%/.exec(f), a = !!t.horizFirst, v = o !== a, y = v ? ["width", "height"] : ["height", "width"],
            p = t.duration / 2, w = {}, b = {};
        n.effects.save(u, s);
        u.show();
        r = n.effects.createWrapper(u).css({ overflow: "hidden" });
        e = v ? [r.width(), r.height()] : [r.height(), r.width()];
        l && (f = parseInt(l[1], 10) / 100 * e[c ? 0 : 1]);
        o && r.css(a ? { height: 0, width: f } : { height: f, width: 0 });
        w[y[0]] = o ? e[0] : f;
        b[y[1]] = o ? e[1] : 0;
        r.animate(w, p, t.easing).animate(b, p, t.easing, function () {
            c && u.hide();
            n.effects.restore(u, s);
            n.effects.removeWrapper(u);
            i()
        })
    };
    n.effects.effect.highlight = function (t, i) {
        var r = n(this), u = ["backgroundImage", "backgroundColor", "opacity"],
            f = n.effects.setMode(r, t.mode || "show"), e = { backgroundColor: r.css("backgroundColor") };
        "hide" === f && (e.opacity = 0);
        n.effects.save(r, u);
        r.show().css({ backgroundImage: "none", backgroundColor: t.color || "#ffff99" }).animate(e, {
            queue: !1,
            duration: t.duration,
            easing: t.easing,
            complete: function () {
                "hide" === f && r.hide();
                n.effects.restore(r, u);
                i()
            }
        })
    };
    n.effects.effect.size = function (t, i) {
        var f, l, u, r = n(this),
            w = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"],
            a = ["width", "height", "overflow"], v = ["fontSize"],
            e = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"],
            o = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"],
            h = n.effects.setMode(r, t.mode || "effect"), y = t.restore || "effect" !== h, c = t.scale || "both",
            b = t.origin || ["middle", "center"], k = r.css("position"),
            s = y ? w : ["position", "top", "bottom", "left", "right", "overflow", "opacity"],
            p = { height: 0, width: 0, outerHeight: 0, outerWidth: 0 };
        "show" === h && r.show();
        f = { height: r.height(), width: r.width(), outerHeight: r.outerHeight(), outerWidth: r.outerWidth() };
        "toggle" === t.mode && "show" === h ? (r.from = t.to || p, r.to = t.from || f) : (r.from = t.from || ("show" === h ? p : f), r.to = t.to || ("hide" === h ? p : f));
        u = {
            from: { y: r.from.height / f.height, x: r.from.width / f.width },
            to: { y: r.to.height / f.height, x: r.to.width / f.width }
        };
        ("box" === c || "both" === c) && (u.from.y !== u.to.y && (s = s.concat(e), r.from = n.effects.setTransition(r, e, u.from.y, r.from), r.to = n.effects.setTransition(r, e, u.to.y, r.to)), u.from.x !== u.to.x && (s = s.concat(o), r.from = n.effects.setTransition(r, o, u.from.x, r.from), r.to = n.effects.setTransition(r, o, u.to.x, r.to)));
        ("content" === c || "both" === c) && u.from.y !== u.to.y && (s = s.concat(v).concat(a), r.from = n.effects.setTransition(r, v, u.from.y, r.from), r.to = n.effects.setTransition(r, v, u.to.y, r.to));
        n.effects.save(r, s);
        r.show();
        n.effects.createWrapper(r);
        r.css("overflow", "hidden").css(r.from);
        b && (l = n.effects.getBaseline(b, f), r.from.top = (f.outerHeight - r.outerHeight()) * l.y, r.from.left = (f.outerWidth - r.outerWidth()) * l.x, r.to.top = (f.outerHeight - r.to.outerHeight) * l.y, r.to.left = (f.outerWidth - r.to.outerWidth) * l.x);
        r.css(r.from);
        ("content" === c || "both" === c) && (e = e.concat(["marginTop", "marginBottom"]).concat(v), o = o.concat(["marginLeft", "marginRight"]), a = w.concat(e).concat(o), r.find("*[width]").each(function () {
            var i = n(this),
                r = { height: i.height(), width: i.width(), outerHeight: i.outerHeight(), outerWidth: i.outerWidth() };
            y && n.effects.save(i, a);
            i.from = {
                height: r.height * u.from.y,
                width: r.width * u.from.x,
                outerHeight: r.outerHeight * u.from.y,
                outerWidth: r.outerWidth * u.from.x
            };
            i.to = {
                height: r.height * u.to.y,
                width: r.width * u.to.x,
                outerHeight: r.height * u.to.y,
                outerWidth: r.width * u.to.x
            };
            u.from.y !== u.to.y && (i.from = n.effects.setTransition(i, e, u.from.y, i.from), i.to = n.effects.setTransition(i, e, u.to.y, i.to));
            u.from.x !== u.to.x && (i.from = n.effects.setTransition(i, o, u.from.x, i.from), i.to = n.effects.setTransition(i, o, u.to.x, i.to));
            i.css(i.from);
            i.animate(i.to, t.duration, t.easing, function () {
                y && n.effects.restore(i, a)
            })
        }));
        r.animate(r.to, {
            queue: !1, duration: t.duration, easing: t.easing, complete: function () {
                0 === r.to.opacity && r.css("opacity", r.from.opacity);
                "hide" === h && r.hide();
                n.effects.restore(r, s);
                y || ("static" === k ? r.css({
                    position: "relative",
                    top: r.to.top,
                    left: r.to.left
                }) : n.each(["top", "left"], function (n, t) {
                    r.css(t, function (t, i) {
                        var f = parseInt(i, 10), u = n ? r.to.left : r.to.top;
                        return "auto" === i ? u + "px" : f + u + "px"
                    })
                }));
                n.effects.removeWrapper(r);
                i()
            }
        })
    };
    n.effects.effect.scale = function (t, i) {
        var u = n(this), r = n.extend(!0, {}, t), f = n.effects.setMode(u, t.mode || "effect"),
            s = parseInt(t.percent, 10) || (0 === parseInt(t.percent, 10) ? 0 : "hide" === f ? 0 : 100),
            h = t.direction || "both", c = t.origin,
            e = { height: u.height(), width: u.width(), outerHeight: u.outerHeight(), outerWidth: u.outerWidth() },
            o = { y: "horizontal" !== h ? s / 100 : 1, x: "vertical" !== h ? s / 100 : 1 };
        r.effect = "size";
        r.queue = !1;
        r.complete = i;
        "effect" !== f && (r.origin = c || ["middle", "center"], r.restore = !0);
        r.from = t.from || ("show" === f ? { height: 0, width: 0, outerHeight: 0, outerWidth: 0 } : e);
        r.to = {
            height: e.height * o.y,
            width: e.width * o.x,
            outerHeight: e.outerHeight * o.y,
            outerWidth: e.outerWidth * o.x
        };
        r.fade && ("show" === f && (r.from.opacity = 0, r.to.opacity = 1), "hide" === f && (r.from.opacity = 1, r.to.opacity = 0));
        u.effect(r)
    };
    n.effects.effect.puff = function (t, i) {
        var r = n(this), e = n.effects.setMode(r, t.mode || "hide"), o = "hide" === e,
            s = parseInt(t.percent, 10) || 150, f = s / 100,
            u = { height: r.height(), width: r.width(), outerHeight: r.outerHeight(), outerWidth: r.outerWidth() };
        n.extend(t, {
            effect: "scale",
            queue: !1,
            fade: !0,
            mode: e,
            complete: i,
            percent: o ? s : 100,
            from: o ? u : {
                height: u.height * f,
                width: u.width * f,
                outerHeight: u.outerHeight * f,
                outerWidth: u.outerWidth * f
            }
        });
        r.effect(t)
    };
    n.effects.effect.pulsate = function (t, i) {
        var e, r = n(this), o = n.effects.setMode(r, t.mode || "show"), h = "show" === o, a = "hide" === o,
            v = h || "hide" === o, s = 2 * (t.times || 5) + (v ? 1 : 0), c = t.duration / s, u = 0, f = r.queue(),
            l = f.length;
        for ((h || !r.is(":visible")) && (r.css("opacity", 0).show(), u = 1), e = 1; s > e; e++) r.animate({ opacity: u }, c, t.easing), u = 1 - u;
        r.animate({ opacity: u }, c, t.easing);
        r.queue(function () {
            a && r.hide();
            i()
        });
        l > 1 && f.splice.apply(f, [1, 0].concat(f.splice(l, s + 1)));
        r.dequeue()
    };
    n.effects.effect.shake = function (t, i) {
        var o, r = n(this), v = ["position", "top", "bottom", "left", "right", "height", "width"],
            k = n.effects.setMode(r, t.mode || "effect"), f = t.direction || "left", s = t.distance || 20,
            y = t.times || 3, p = 2 * y + 1, u = Math.round(t.duration / p),
            h = "up" === f || "down" === f ? "top" : "left", c = "up" === f || "left" === f, l = {}, a = {}, w = {},
            e = r.queue(), b = e.length;
        for (n.effects.save(r, v), r.show(), n.effects.createWrapper(r), l[h] = (c ? "-=" : "+=") + s, a[h] = (c ? "+=" : "-=") + 2 * s, w[h] = (c ? "-=" : "+=") + 2 * s, r.animate(l, u, t.easing), o = 1; y > o; o++) r.animate(a, u, t.easing).animate(w, u, t.easing);
        r.animate(a, u, t.easing).animate(l, u / 2, t.easing).queue(function () {
            "hide" === k && r.hide();
            n.effects.restore(r, v);
            n.effects.removeWrapper(r);
            i()
        });
        b > 1 && e.splice.apply(e, [1, 0].concat(e.splice(b, p + 1)));
        r.dequeue()
    };
    n.effects.effect.slide = function (t, i) {
        var u, r = n(this), s = ["position", "top", "bottom", "left", "right", "width", "height"],
            h = n.effects.setMode(r, t.mode || "show"), c = "show" === h, f = t.direction || "left",
            e = "up" === f || "down" === f ? "top" : "left", o = "up" === f || "left" === f, l = {};
        n.effects.save(r, s);
        r.show();
        u = t.distance || r["top" === e ? "outerHeight" : "outerWidth"](!0);
        n.effects.createWrapper(r).css({ overflow: "hidden" });
        c && r.css(e, o ? isNaN(u) ? "-" + u : -u : u);
        l[e] = (c ? o ? "+=" : "-=" : o ? "-=" : "+=") + u;
        r.animate(l, {
            queue: !1, duration: t.duration, easing: t.easing, complete: function () {
                "hide" === h && r.hide();
                n.effects.restore(r, s);
                n.effects.removeWrapper(r);
                i()
            }
        })
    };
    n.effects.effect.transfer = function (t, i) {
        var u = n(this), r = n(t.to), f = "fixed" === r.css("position"), e = n("body"), o = f ? e.scrollTop() : 0,
            s = f ? e.scrollLeft() : 0, h = r.offset(),
            l = { top: h.top - o, left: h.left - s, height: r.innerHeight(), width: r.innerWidth() }, c = u.offset(),
            a = n("<div class='ui-effects-transfer'><\/div>").appendTo(document.body).addClass(t.className).css({
                top: c.top - o,
                left: c.left - s,
                height: u.innerHeight(),
                width: u.innerWidth(),
                position: f ? "fixed" : "absolute"
            }).animate(l, t.duration, t.easing, function () {
                a.remove();
                i()
            })
    };
    n.widget("ui.progressbar", {
        version: "1.11.4", options: { max: 100, value: 0, change: null, complete: null }, min: 0, _create: function () {
            this.oldValue = this.options.value = this._constrainedValue();
            this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
                role: "progressbar",
                "aria-valuemin": this.min
            });
            this.valueDiv = n("<div class='ui-progressbar-value ui-widget-header ui-corner-left'><\/div>").appendTo(this.element);
            this._refreshValue()
        }, _destroy: function () {
            this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
            this.valueDiv.remove()
        }, value: function (n) {
            return void 0 === n ? this.options.value : (this.options.value = this._constrainedValue(n), this._refreshValue(), void 0)
        }, _constrainedValue: function (n) {
            return void 0 === n && (n = this.options.value), this.indeterminate = n === !1, "number" != typeof n && (n = 0), this.indeterminate ? !1 : Math.min(this.options.max, Math.max(this.min, n))
        }, _setOptions: function (n) {
            var t = n.value;
            delete n.value;
            this._super(n);
            this.options.value = this._constrainedValue(t);
            this._refreshValue()
        }, _setOption: function (n, t) {
            "max" === n && (t = Math.max(this.min, t));
            "disabled" === n && this.element.toggleClass("ui-state-disabled", !!t).attr("aria-disabled", t);
            this._super(n, t)
        }, _percentage: function () {
            return this.indeterminate ? 100 : 100 * (this.options.value - this.min) / (this.options.max - this.min)
        }, _refreshValue: function () {
            var t = this.options.value, i = this._percentage();
            this.valueDiv.toggle(this.indeterminate || t > this.min).toggleClass("ui-corner-right", t === this.options.max).width(i.toFixed(0) + "%");
            this.element.toggleClass("ui-progressbar-indeterminate", this.indeterminate);
            this.indeterminate ? (this.element.removeAttr("aria-valuenow"), this.overlayDiv || (this.overlayDiv = n("<div class='ui-progressbar-overlay'><\/div>").appendTo(this.valueDiv))) : (this.element.attr({
                "aria-valuemax": this.options.max,
                "aria-valuenow": t
            }), this.overlayDiv && (this.overlayDiv.remove(), this.overlayDiv = null));
            this.oldValue !== t && (this.oldValue = t, this._trigger("change"));
            t === this.options.max && this._trigger("complete")
        }
    });
    n.widget("ui.selectable", n.ui.mouse, {
        version: "1.11.4",
        options: {
            appendTo: "body",
            autoRefresh: !0,
            distance: 0,
            filter: "*",
            tolerance: "touch",
            selected: null,
            selecting: null,
            start: null,
            stop: null,
            unselected: null,
            unselecting: null
        },
        _create: function () {
            var t, i = this;
            this.element.addClass("ui-selectable");
            this.dragged = !1;
            this.refresh = function () {
                t = n(i.options.filter, i.element[0]);
                t.addClass("ui-selectee");
                t.each(function () {
                    var t = n(this), i = t.offset();
                    n.data(this, "selectable-item", {
                        element: this,
                        $element: t,
                        left: i.left,
                        top: i.top,
                        right: i.left + t.outerWidth(),
                        bottom: i.top + t.outerHeight(),
                        startselected: !1,
                        selected: t.hasClass("ui-selected"),
                        selecting: t.hasClass("ui-selecting"),
                        unselecting: t.hasClass("ui-unselecting")
                    })
                })
            };
            this.refresh();
            this.selectees = t.addClass("ui-selectee");
            this._mouseInit();
            this.helper = n("<div class='ui-selectable-helper'><\/div>")
        },
        _destroy: function () {
            this.selectees.removeClass("ui-selectee").removeData("selectable-item");
            this.element.removeClass("ui-selectable ui-selectable-disabled");
            this._mouseDestroy()
        },
        _mouseStart: function (t) {
            var i = this, r = this.options;
            this.opos = [t.pageX, t.pageY];
            this.options.disabled || (this.selectees = n(r.filter, this.element[0]), this._trigger("start", t), n(r.appendTo).append(this.helper), this.helper.css({
                left: t.pageX,
                top: t.pageY,
                width: 0,
                height: 0
            }), r.autoRefresh && this.refresh(), this.selectees.filter(".ui-selected").each(function () {
                var r = n.data(this, "selectable-item");
                r.startselected = !0;
                t.metaKey || t.ctrlKey || (r.$element.removeClass("ui-selected"), r.selected = !1, r.$element.addClass("ui-unselecting"), r.unselecting = !0, i._trigger("unselecting", t, { unselecting: r.element }))
            }), n(t.target).parents().addBack().each(function () {
                var u, r = n.data(this, "selectable-item");
                if (r) return (u = !t.metaKey && !t.ctrlKey || !r.$element.hasClass("ui-selected"), r.$element.removeClass(u ? "ui-unselecting" : "ui-selected").addClass(u ? "ui-selecting" : "ui-unselecting"), r.unselecting = !u, r.selecting = u, r.selected = u, u ? i._trigger("selecting", t, { selecting: r.element }) : i._trigger("unselecting", t, { unselecting: r.element }), !1)
            }))
        },
        _mouseDrag: function (t) {
            if (this.dragged = !0, !this.options.disabled) {
                var e, o = this, s = this.options, i = this.opos[0], r = this.opos[1], u = t.pageX, f = t.pageY;
                return i > u && (e = u, u = i, i = e), r > f && (e = f, f = r, r = e), this.helper.css({
                    left: i,
                    top: r,
                    width: u - i,
                    height: f - r
                }), this.selectees.each(function () {
                    var e = n.data(this, "selectable-item"), h = !1;
                    e && e.element !== o.element[0] && ("touch" === s.tolerance ? h = !(e.left > u || i > e.right || e.top > f || r > e.bottom) : "fit" === s.tolerance && (h = e.left > i && u > e.right && e.top > r && f > e.bottom), h ? (e.selected && (e.$element.removeClass("ui-selected"), e.selected = !1), e.unselecting && (e.$element.removeClass("ui-unselecting"), e.unselecting = !1), e.selecting || (e.$element.addClass("ui-selecting"), e.selecting = !0, o._trigger("selecting", t, { selecting: e.element }))) : (e.selecting && ((t.metaKey || t.ctrlKey) && e.startselected ? (e.$element.removeClass("ui-selecting"), e.selecting = !1, e.$element.addClass("ui-selected"), e.selected = !0) : (e.$element.removeClass("ui-selecting"), e.selecting = !1, e.startselected && (e.$element.addClass("ui-unselecting"), e.unselecting = !0), o._trigger("unselecting", t, { unselecting: e.element }))), e.selected && (t.metaKey || t.ctrlKey || e.startselected || (e.$element.removeClass("ui-selected"), e.selected = !1, e.$element.addClass("ui-unselecting"), e.unselecting = !0, o._trigger("unselecting", t, { unselecting: e.element })))))
                }), !1
            }
        },
        _mouseStop: function (t) {
            var i = this;
            return this.dragged = !1, n(".ui-unselecting", this.element[0]).each(function () {
                var r = n.data(this, "selectable-item");
                r.$element.removeClass("ui-unselecting");
                r.unselecting = !1;
                r.startselected = !1;
                i._trigger("unselected", t, { unselected: r.element })
            }), n(".ui-selecting", this.element[0]).each(function () {
                var r = n.data(this, "selectable-item");
                r.$element.removeClass("ui-selecting").addClass("ui-selected");
                r.selecting = !1;
                r.selected = !0;
                r.startselected = !0;
                i._trigger("selected", t, { selected: r.element })
            }), this._trigger("stop", t), this.helper.remove(), !1
        }
    });
    n.widget("ui.selectmenu", {
        version: "1.11.4",
        defaultElement: "<select>",
        options: {
            appendTo: null,
            disabled: null,
            icons: { button: "ui-icon-triangle-1-s" },
            position: { my: "left top", at: "left bottom", collision: "none" },
            width: null,
            change: null,
            close: null,
            focus: null,
            open: null,
            select: null
        },
        _create: function () {
            var n = this.element.uniqueId().attr("id");
            this.ids = { element: n, button: n + "-button", menu: n + "-menu" };
            this._drawButton();
            this._drawMenu();
            this.options.disabled && this.disable()
        },
        _drawButton: function () {
            var t = this;
            this.label = n("label[for='" + this.ids.element + "']").attr("for", this.ids.button);
            this._on(this.label, {
                click: function (n) {
                    this.button.focus();
                    n.preventDefault()
                }
            });
            this.element.hide();
            this.button = n("<span>", {
                "class": "ui-selectmenu-button ui-widget ui-state-default ui-corner-all",
                tabindex: this.options.disabled ? -1 : 0,
                id: this.ids.button,
                role: "combobox",
                "aria-expanded": "false",
                "aria-autocomplete": "list",
                "aria-owns": this.ids.menu,
                "aria-haspopup": "true"
            }).insertAfter(this.element);
            n("<span>", { "class": "ui-icon " + this.options.icons.button }).prependTo(this.button);
            this.buttonText = n("<span>", { "class": "ui-selectmenu-text" }).appendTo(this.button);
            this._setText(this.buttonText, this.element.find("option:selected").text());
            this._resizeButton();
            this._on(this.button, this._buttonEvents);
            this.button.one("focusin", function () {
                t.menuItems || t._refreshMenu()
            });
            this._hoverable(this.button);
            this._focusable(this.button)
        },
        _drawMenu: function () {
            var t = this;
            this.menu = n("<ul>", { "aria-hidden": "true", "aria-labelledby": this.ids.button, id: this.ids.menu });
            this.menuWrap = n("<div>", { "class": "ui-selectmenu-menu ui-front" }).append(this.menu).appendTo(this._appendTo());
            this.menuInstance = this.menu.menu({
                role: "listbox", select: function (n, i) {
                    n.preventDefault();
                    t._setSelection();
                    t._select(i.item.data("ui-selectmenu-item"), n)
                }, focus: function (n, i) {
                    var r = i.item.data("ui-selectmenu-item");
                    null != t.focusIndex && r.index !== t.focusIndex && (t._trigger("focus", n, { item: r }), t.isOpen || t._select(r, n));
                    t.focusIndex = r.index;
                    t.button.attr("aria-activedescendant", t.menuItems.eq(r.index).attr("id"))
                }
            }).menu("instance");
            this.menu.addClass("ui-corner-bottom").removeClass("ui-corner-all");
            this.menuInstance._off(this.menu, "mouseleave");
            this.menuInstance._closeOnDocumentClick = function () {
                return !1
            };
            this.menuInstance._isDivider = function () {
                return !1
            }
        },
        refresh: function () {
            this._refreshMenu();
            this._setText(this.buttonText, this._getSelectedItem().text());
            this.options.width || this._resizeButton()
        },
        _refreshMenu: function () {
            this.menu.empty();
            var n, t = this.element.find("option");
            t.length && (this._parseOptions(t), this._renderMenu(this.menu, this.items), this.menuInstance.refresh(), this.menuItems = this.menu.find("li").not(".ui-selectmenu-optgroup"), n = this._getSelectedItem(), this.menuInstance.focus(null, n), this._setAria(n.data("ui-selectmenu-item")), this._setOption("disabled", this.element.prop("disabled")))
        },
        open: function (n) {
            this.options.disabled || (this.menuItems ? (this.menu.find(".ui-state-focus").removeClass("ui-state-focus"), this.menuInstance.focus(null, this._getSelectedItem())) : this._refreshMenu(), this.isOpen = !0, this._toggleAttr(), this._resizeMenu(), this._position(), this._on(this.document, this._documentClick), this._trigger("open", n))
        },
        _position: function () {
            this.menuWrap.position(n.extend({ of: this.button }, this.options.position))
        },
        close: function (n) {
            this.isOpen && (this.isOpen = !1, this._toggleAttr(), this.range = null, this._off(this.document), this._trigger("close", n))
        },
        widget: function () {
            return this.button
        },
        menuWidget: function () {
            return this.menu
        },
        _renderMenu: function (t, i) {
            var u = this, r = "";
            n.each(i, function (i, f) {
                f.optgroup !== r && (n("<li>", {
                    "class": "ui-selectmenu-optgroup ui-menu-divider" + (f.element.parent("optgroup").prop("disabled") ? " ui-state-disabled" : ""),
                    text: f.optgroup
                }).appendTo(t), r = f.optgroup);
                u._renderItemData(t, f)
            })
        },
        _renderItemData: function (n, t) {
            return this._renderItem(n, t).data("ui-selectmenu-item", t)
        },
        _renderItem: function (t, i) {
            var r = n("<li>");
            return i.disabled && r.addClass("ui-state-disabled"), this._setText(r, i.label), r.appendTo(t)
        },
        _setText: function (n, t) {
            t ? n.text(t) : n.html("&#160;")
        },
        _move: function (n, t) {
            var i, r, u = ".ui-menu-item";
            this.isOpen ? i = this.menuItems.eq(this.focusIndex) : (i = this.menuItems.eq(this.element[0].selectedIndex), u += ":not(.ui-state-disabled)");
            r = "first" === n || "last" === n ? i["first" === n ? "prevAll" : "nextAll"](u).eq(-1) : i[n + "All"](u).eq(0);
            r.length && this.menuInstance.focus(t, r)
        },
        _getSelectedItem: function () {
            return this.menuItems.eq(this.element[0].selectedIndex)
        },
        _toggle: function (n) {
            this[this.isOpen ? "close" : "open"](n)
        },
        _setSelection: function () {
            var n;
            this.range && (window.getSelection ? (n = window.getSelection(), n.removeAllRanges(), n.addRange(this.range)) : this.range.select(), this.button.focus())
        },
        _documentClick: {
            mousedown: function (t) {
                this.isOpen && (n(t.target).closest(".ui-selectmenu-menu, #" + this.ids.button).length || this.close(t))
            }
        },
        _buttonEvents: {
            mousedown: function () {
                var n;
                window.getSelection ? (n = window.getSelection(), n.rangeCount && (this.range = n.getRangeAt(0))) : this.range = document.selection.createRange()
            }, click: function (n) {
                this._setSelection();
                this._toggle(n)
            }, keydown: function (t) {
                var i = !0;
                switch (t.keyCode) {
                    case n.ui.keyCode.TAB:
                    case n.ui.keyCode.ESCAPE:
                        this.close(t);
                        i = !1;
                        break;
                    case n.ui.keyCode.ENTER:
                        this.isOpen && this._selectFocusedItem(t);
                        break;
                    case n.ui.keyCode.UP:
                        t.altKey ? this._toggle(t) : this._move("prev", t);
                        break;
                    case n.ui.keyCode.DOWN:
                        t.altKey ? this._toggle(t) : this._move("next", t);
                        break;
                    case n.ui.keyCode.SPACE:
                        this.isOpen ? this._selectFocusedItem(t) : this._toggle(t);
                        break;
                    case n.ui.keyCode.LEFT:
                        this._move("prev", t);
                        break;
                    case n.ui.keyCode.RIGHT:
                        this._move("next", t);
                        break;
                    case n.ui.keyCode.HOME:
                    case n.ui.keyCode.PAGE_UP:
                        this._move("first", t);
                        break;
                    case n.ui.keyCode.END:
                    case n.ui.keyCode.PAGE_DOWN:
                        this._move("last", t);
                        break;
                    default:
                        this.menu.trigger(t);
                        i = !1
                }
                i && t.preventDefault()
            }
        },
        _selectFocusedItem: function (n) {
            var t = this.menuItems.eq(this.focusIndex);
            t.hasClass("ui-state-disabled") || this._select(t.data("ui-selectmenu-item"), n)
        },
        _select: function (n, t) {
            var i = this.element[0].selectedIndex;
            this.element[0].selectedIndex = n.index;
            this._setText(this.buttonText, n.label);
            this._setAria(n);
            this._trigger("select", t, { item: n });
            n.index !== i && this._trigger("change", t, { item: n });
            this.close(t)
        },
        _setAria: function (n) {
            var t = this.menuItems.eq(n.index).attr("id");
            this.button.attr({ "aria-labelledby": t, "aria-activedescendant": t });
            this.menu.attr("aria-activedescendant", t)
        },
        _setOption: function (n, t) {
            "icons" === n && this.button.find("span.ui-icon").removeClass(this.options.icons.button).addClass(t.button);
            this._super(n, t);
            "appendTo" === n && this.menuWrap.appendTo(this._appendTo());
            "disabled" === n && (this.menuInstance.option("disabled", t), this.button.toggleClass("ui-state-disabled", t).attr("aria-disabled", t), this.element.prop("disabled", t), t ? (this.button.attr("tabindex", -1), this.close()) : this.button.attr("tabindex", 0));
            "width" === n && this._resizeButton()
        },
        _appendTo: function () {
            var t = this.options.appendTo;
            return t && (t = t.jquery || t.nodeType ? n(t) : this.document.find(t).eq(0)), t && t[0] || (t = this.element.closest(".ui-front")), t.length || (t = this.document[0].body), t
        },
        _toggleAttr: function () {
            this.button.toggleClass("ui-corner-top", this.isOpen).toggleClass("ui-corner-all", !this.isOpen).attr("aria-expanded", this.isOpen);
            this.menuWrap.toggleClass("ui-selectmenu-open", this.isOpen);
            this.menu.attr("aria-hidden", !this.isOpen)
        },
        _resizeButton: function () {
            var n = this.options.width;
            n || (n = this.element.show().outerWidth(), this.element.hide());
            this.button.outerWidth(n)
        },
        _resizeMenu: function () {
            this.menu.outerWidth(Math.max(this.button.outerWidth(), this.menu.width("").outerWidth() + 1))
        },
        _getCreateOptions: function () {
            return { disabled: this.element.prop("disabled") }
        },
        _parseOptions: function (t) {
            var i = [];
            t.each(function (t, r) {
                var u = n(r), f = u.parent("optgroup");
                i.push({
                    element: u,
                    index: t,
                    value: u.val(),
                    label: u.text(),
                    optgroup: f.attr("label") || "",
                    disabled: f.prop("disabled") || u.prop("disabled")
                })
            });
            this.items = i
        },
        _destroy: function () {
            this.menuWrap.remove();
            this.button.remove();
            this.element.show();
            this.element.removeUniqueId();
            this.label.attr("for", this.ids.element)
        }
    });
    n.widget("ui.slider", n.ui.mouse, {
        version: "1.11.4",
        widgetEventPrefix: "slide",
        options: {
            animate: !1,
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: !1,
            step: 1,
            value: 0,
            values: null,
            change: null,
            slide: null,
            start: null,
            stop: null
        },
        numPages: 5,
        _create: function () {
            this._keySliding = !1;
            this._mouseSliding = !1;
            this._animateOff = !0;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this._calculateNewMax();
            this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget ui-widget-content ui-corner-all");
            this._refresh();
            this._setOption("disabled", this.options.disabled);
            this._animateOff = !1
        },
        _refresh: function () {
            this._createRange();
            this._createHandles();
            this._setupEvents();
            this._refreshValue()
        },
        _createHandles: function () {
            var r, i, u = this.options,
                t = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"), f = [];
            for (i = u.values && u.values.length || 1, t.length > i && (t.slice(i).remove(), t = t.slice(0, i)), r = t.length; i > r; r++) f.push("<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'><\/span>");
            this.handles = t.add(n(f.join("")).appendTo(this.element));
            this.handle = this.handles.eq(0);
            this.handles.each(function (t) {
                n(this).data("ui-slider-handle-index", t)
            })
        },
        _createRange: function () {
            var t = this.options, i = "";
            t.range ? (t.range === !0 && (t.values ? t.values.length && 2 !== t.values.length ? t.values = [t.values[0], t.values[0]] : n.isArray(t.values) && (t.values = t.values.slice(0)) : t.values = [this._valueMin(), this._valueMin()]), this.range && this.range.length ? this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({
                left: "",
                bottom: ""
            }) : (this.range = n("<div><\/div>").appendTo(this.element), i = "ui-slider-range ui-widget-header ui-corner-all"), this.range.addClass(i + ("min" === t.range || "max" === t.range ? " ui-slider-range-" + t.range : ""))) : (this.range && this.range.remove(), this.range = null)
        },
        _setupEvents: function () {
            this._off(this.handles);
            this._on(this.handles, this._handleEvents);
            this._hoverable(this.handles);
            this._focusable(this.handles)
        },
        _destroy: function () {
            this.handles.remove();
            this.range && this.range.remove();
            this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all");
            this._mouseDestroy()
        },
        _mouseCapture: function (t) {
            var s, f, r, i, u, h, e, c, o = this, l = this.options;
            return l.disabled ? !1 : (this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            }, this.elementOffset = this.element.offset(), s = {
                x: t.pageX,
                y: t.pageY
            }, f = this._normValueFromMouse(s), r = this._valueMax() - this._valueMin() + 1, this.handles.each(function (t) {
                var e = Math.abs(f - o.values(t));
                (r > e || r === e && (t === o._lastChangedValue || o.values(t) === l.min)) && (r = e, i = n(this), u = t)
            }), h = this._start(t, u), h === !1 ? !1 : (this._mouseSliding = !0, this._handleIndex = u, i.addClass("ui-state-active").focus(), e = i.offset(), c = !n(t.target).parents().addBack().is(".ui-slider-handle"), this._clickOffset = c ? {
                left: 0,
                top: 0
            } : {
                    left: t.pageX - e.left - i.width() / 2,
                    top: t.pageY - e.top - i.height() / 2 - (parseInt(i.css("borderTopWidth"), 10) || 0) - (parseInt(i.css("borderBottomWidth"), 10) || 0) + (parseInt(i.css("marginTop"), 10) || 0)
                }, this.handles.hasClass("ui-state-hover") || this._slide(t, u, f), this._animateOff = !0, !0))
        },
        _mouseStart: function () {
            return !0
        },
        _mouseDrag: function (n) {
            var t = { x: n.pageX, y: n.pageY }, i = this._normValueFromMouse(t);
            return this._slide(n, this._handleIndex, i), !1
        },
        _mouseStop: function (n) {
            return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(n, this._handleIndex), this._change(n, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
        },
        _detectOrientation: function () {
            this.orientation = "vertical" === this.options.orientation ? "vertical" : "horizontal"
        },
        _normValueFromMouse: function (n) {
            var i, r, t, u, f;
            return "horizontal" === this.orientation ? (i = this.elementSize.width, r = n.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (i = this.elementSize.height, r = n.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), t = r / i, t > 1 && (t = 1), 0 > t && (t = 0), "vertical" === this.orientation && (t = 1 - t), u = this._valueMax() - this._valueMin(), f = this._valueMin() + t * u, this._trimAlignValue(f)
        },
        _start: function (n, t) {
            var i = { handle: this.handles[t], value: this.value() };
            return this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values()), this._trigger("start", n, i)
        },
        _slide: function (n, t, i) {
            var r, f, u;
            this.options.values && this.options.values.length ? (r = this.values(t ? 0 : 1), 2 === this.options.values.length && this.options.range === !0 && (0 === t && i > r || 1 === t && r > i) && (i = r), i !== this.values(t) && (f = this.values(), f[t] = i, u = this._trigger("slide", n, {
                handle: this.handles[t],
                value: i,
                values: f
            }), r = this.values(t ? 0 : 1), u !== !1 && this.values(t, i))) : i !== this.value() && (u = this._trigger("slide", n, {
                handle: this.handles[t],
                value: i
            }), u !== !1 && this.value(i))
        },
        _stop: function (n, t) {
            var i = { handle: this.handles[t], value: this.value() };
            this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values());
            this._trigger("stop", n, i)
        },
        _change: function (n, t) {
            if (!this._keySliding && !this._mouseSliding) {
                var i = { handle: this.handles[t], value: this.value() };
                this.options.values && this.options.values.length && (i.value = this.values(t), i.values = this.values());
                this._lastChangedValue = t;
                this._trigger("change", n, i)
            }
        },
        value: function (n) {
            return arguments.length ? (this.options.value = this._trimAlignValue(n), this._refreshValue(), this._change(null, 0), void 0) : this._value()
        },
        values: function (t, i) {
            var u, f, r;
            if (arguments.length > 1) return this.options.values[t] = this._trimAlignValue(i), this._refreshValue(), this._change(null, t), void 0;
            if (!arguments.length) return this._values();
            if (!n.isArray(arguments[0])) return this.options.values && this.options.values.length ? this._values(t) : this.value();
            for (u = this.options.values, f = arguments[0], r = 0; u.length > r; r += 1) u[r] = this._trimAlignValue(f[r]), this._change(null, r);
            this._refreshValue()
        },
        _setOption: function (t, i) {
            var r, u = 0;
            switch ("range" === t && this.options.range === !0 && ("min" === i ? (this.options.value = this._values(0), this.options.values = null) : "max" === i && (this.options.value = this._values(this.options.values.length - 1), this.options.values = null)), n.isArray(this.options.values) && (u = this.options.values.length), "disabled" === t && this.element.toggleClass("ui-state-disabled", !!i), this._super(t, i), t) {
                case "orientation":
                    this._detectOrientation();
                    this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation);
                    this._refreshValue();
                    this.handles.css("horizontal" === i ? "bottom" : "left", "");
                    break;
                case "value":
                    this._animateOff = !0;
                    this._refreshValue();
                    this._change(null, 0);
                    this._animateOff = !1;
                    break;
                case "values":
                    for (this._animateOff = !0, this._refreshValue(), r = 0; u > r; r += 1) this._change(null, r);
                    this._animateOff = !1;
                    break;
                case "step":
                case "min":
                case "max":
                    this._animateOff = !0;
                    this._calculateNewMax();
                    this._refreshValue();
                    this._animateOff = !1;
                    break;
                case "range":
                    this._animateOff = !0;
                    this._refresh();
                    this._animateOff = !1
            }
        },
        _value: function () {
            var n = this.options.value;
            return this._trimAlignValue(n)
        },
        _values: function (n) {
            var r, t, i;
            if (arguments.length) return r = this.options.values[n], r = this._trimAlignValue(r);
            if (this.options.values && this.options.values.length) {
                for (t = this.options.values.slice(), i = 0; t.length > i; i += 1) t[i] = this._trimAlignValue(t[i]);
                return t
            }
            return []
        },
        _trimAlignValue: function (n) {
            if (this._valueMin() >= n) return this._valueMin();
            if (n >= this._valueMax()) return this._valueMax();
            var t = this.options.step > 0 ? this.options.step : 1, i = (n - this._valueMin()) % t, r = n - i;
            return 2 * Math.abs(i) >= t && (r += i > 0 ? t : -t), parseFloat(r.toFixed(5))
        },
        _calculateNewMax: function () {
            var n = this.options.max, t = this._valueMin(), i = this.options.step,
                r = Math.floor(+(n - t).toFixed(this._precision()) / i) * i;
            n = r + t;
            this.max = parseFloat(n.toFixed(this._precision()))
        },
        _precision: function () {
            var n = this._precisionOf(this.options.step);
            return null !== this.options.min && (n = Math.max(n, this._precisionOf(this.options.min))), n
        },
        _precisionOf: function (n) {
            var t = "" + n, i = t.indexOf(".");
            return -1 === i ? 0 : t.length - i - 1
        },
        _valueMin: function () {
            return this.options.min
        },
        _valueMax: function () {
            return this.max
        },
        _refreshValue: function () {
            var s, t, c, f, h, e = this.options.range, i = this.options, r = this,
                u = this._animateOff ? !1 : i.animate, o = {};
            this.options.values && this.options.values.length ? this.handles.each(function (f) {
                t = 100 * ((r.values(f) - r._valueMin()) / (r._valueMax() - r._valueMin()));
                o["horizontal" === r.orientation ? "left" : "bottom"] = t + "%";
                n(this).stop(1, 1)[u ? "animate" : "css"](o, i.animate);
                r.options.range === !0 && ("horizontal" === r.orientation ? (0 === f && r.range.stop(1, 1)[u ? "animate" : "css"]({ left: t + "%" }, i.animate), 1 === f && r.range[u ? "animate" : "css"]({ width: t - s + "%" }, {
                    queue: !1,
                    duration: i.animate
                })) : (0 === f && r.range.stop(1, 1)[u ? "animate" : "css"]({ bottom: t + "%" }, i.animate), 1 === f && r.range[u ? "animate" : "css"]({ height: t - s + "%" }, {
                    queue: !1,
                    duration: i.animate
                })));
                s = t
            }) : (c = this.value(), f = this._valueMin(), h = this._valueMax(), t = h !== f ? 100 * ((c - f) / (h - f)) : 0, o["horizontal" === this.orientation ? "left" : "bottom"] = t + "%", this.handle.stop(1, 1)[u ? "animate" : "css"](o, i.animate), "min" === e && "horizontal" === this.orientation && this.range.stop(1, 1)[u ? "animate" : "css"]({ width: t + "%" }, i.animate), "max" === e && "horizontal" === this.orientation && this.range[u ? "animate" : "css"]({ width: 100 - t + "%" }, {
                queue: !1,
                duration: i.animate
            }), "min" === e && "vertical" === this.orientation && this.range.stop(1, 1)[u ? "animate" : "css"]({ height: t + "%" }, i.animate), "max" === e && "vertical" === this.orientation && this.range[u ? "animate" : "css"]({ height: 100 - t + "%" }, {
                queue: !1,
                duration: i.animate
            }))
        },
        _handleEvents: {
            keydown: function (t) {
                var e, r, i, u, f = n(t.target).data("ui-slider-handle-index");
                switch (t.keyCode) {
                    case n.ui.keyCode.HOME:
                    case n.ui.keyCode.END:
                    case n.ui.keyCode.PAGE_UP:
                    case n.ui.keyCode.PAGE_DOWN:
                    case n.ui.keyCode.UP:
                    case n.ui.keyCode.RIGHT:
                    case n.ui.keyCode.DOWN:
                    case n.ui.keyCode.LEFT:
                        if (t.preventDefault(), !this._keySliding && (this._keySliding = !0, n(t.target).addClass("ui-state-active"), e = this._start(t, f), e === !1)) return
                }
                switch (u = this.options.step, r = i = this.options.values && this.options.values.length ? this.values(f) : this.value(), t.keyCode) {
                    case n.ui.keyCode.HOME:
                        i = this._valueMin();
                        break;
                    case n.ui.keyCode.END:
                        i = this._valueMax();
                        break;
                    case n.ui.keyCode.PAGE_UP:
                        i = this._trimAlignValue(r + (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case n.ui.keyCode.PAGE_DOWN:
                        i = this._trimAlignValue(r - (this._valueMax() - this._valueMin()) / this.numPages);
                        break;
                    case n.ui.keyCode.UP:
                    case n.ui.keyCode.RIGHT:
                        if (r === this._valueMax()) return;
                        i = this._trimAlignValue(r + u);
                        break;
                    case n.ui.keyCode.DOWN:
                    case n.ui.keyCode.LEFT:
                        if (r === this._valueMin()) return;
                        i = this._trimAlignValue(r - u)
                }
                this._slide(t, f, i)
            }, keyup: function (t) {
                var i = n(t.target).data("ui-slider-handle-index");
                this._keySliding && (this._keySliding = !1, this._stop(t, i), this._change(t, i), n(t.target).removeClass("ui-state-active"))
            }
        }
    });
    n.widget("ui.sortable", n.ui.mouse, {
        version: "1.11.4",
        widgetEventPrefix: "sort",
        ready: !1,
        options: {
            appendTo: "parent",
            axis: !1,
            connectWith: !1,
            containment: !1,
            cursor: "auto",
            cursorAt: !1,
            dropOnEmpty: !0,
            forcePlaceholderSize: !1,
            forceHelperSize: !1,
            grid: !1,
            handle: !1,
            helper: "original",
            items: "> *",
            opacity: !1,
            placeholder: !1,
            revert: !1,
            scroll: !0,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1e3,
            activate: null,
            beforeStop: null,
            change: null,
            deactivate: null,
            out: null,
            over: null,
            receive: null,
            remove: null,
            sort: null,
            start: null,
            stop: null,
            update: null
        },
        _isOverAxis: function (n, t, i) {
            return n >= t && t + i > n
        },
        _isFloating: function (n) {
            return /left|right/.test(n.css("float")) || /inline|table-cell/.test(n.css("display"))
        },
        _create: function () {
            this.containerCache = {};
            this.element.addClass("ui-sortable");
            this.refresh();
            this.offset = this.element.offset();
            this._mouseInit();
            this._setHandleClassName();
            this.ready = !0
        },
        _setOption: function (n, t) {
            this._super(n, t);
            "handle" === n && this._setHandleClassName()
        },
        _setHandleClassName: function () {
            this.element.find(".ui-sortable-handle").removeClass("ui-sortable-handle");
            n.each(this.items, function () {
                (this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item).addClass("ui-sortable-handle")
            })
        },
        _destroy: function () {
            this.element.removeClass("ui-sortable ui-sortable-disabled").find(".ui-sortable-handle").removeClass("ui-sortable-handle");
            this._mouseDestroy();
            for (var n = this.items.length - 1; n >= 0; n--) this.items[n].item.removeData(this.widgetName + "-item");
            return this
        },
        _mouseCapture: function (t, i) {
            var r = null, f = !1, u = this;
            return this.reverting ? !1 : this.options.disabled || "static" === this.options.type ? !1 : (this._refreshItems(t), n(t.target).parents().each(function () {
                if (n.data(this, u.widgetName + "-item") === u) return (r = n(this), !1)
            }), n.data(t.target, u.widgetName + "-item") === u && (r = n(t.target)), r ? !this.options.handle || i || (n(this.options.handle, r).find("*").addBack().each(function () {
                this === t.target && (f = !0)
            }), f) ? (this.currentItem = r, this._removeCurrentsFromItems(), !0) : !1 : !1)
        },
        _mouseStart: function (t, i, r) {
            var f, e, u = this.options;
            if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(t), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            }, n.extend(this.offset, {
                click: { left: t.pageX - this.offset.left, top: t.pageY - this.offset.top },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset()
            }), this.helper.css("position", "absolute"), this.cssPosition = this.helper.css("position"), this.originalPosition = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, u.cursorAt && this._adjustOffsetFromHelper(u.cursorAt), this.domPosition = {
                prev: this.currentItem.prev()[0],
                parent: this.currentItem.parent()[0]
            }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), u.containment && this._setContainment(), u.cursor && "auto" !== u.cursor && (e = this.document.find("body"), this.storedCursor = e.css("cursor"), e.css("cursor", u.cursor), this.storedStylesheet = n("<style>*{ cursor: " + u.cursor + " !important; }<\/style>").appendTo(e)), u.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", u.opacity)), u.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", u.zIndex)), this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", t, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !r) for (f = this.containers.length - 1; f >= 0; f--) this.containers[f]._trigger("activate", t, this._uiHash(this));
            return n.ui.ddmanager && (n.ui.ddmanager.current = this), n.ui.ddmanager && !u.dropBehaviour && n.ui.ddmanager.prepareOffsets(this, t), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(t), !0
        },
        _mouseDrag: function (t) {
            var e, u, f, o, i = this.options, r = !1;
            for (this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== this.document[0] && "HTML" !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < i.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + i.scrollSpeed : t.pageY - this.overflowOffset.top < i.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - i.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < i.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + i.scrollSpeed : t.pageX - this.overflowOffset.left < i.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - i.scrollSpeed)) : (t.pageY - this.document.scrollTop() < i.scrollSensitivity ? r = this.document.scrollTop(this.document.scrollTop() - i.scrollSpeed) : this.window.height() - (t.pageY - this.document.scrollTop()) < i.scrollSensitivity && (r = this.document.scrollTop(this.document.scrollTop() + i.scrollSpeed)), t.pageX - this.document.scrollLeft() < i.scrollSensitivity ? r = this.document.scrollLeft(this.document.scrollLeft() - i.scrollSpeed) : this.window.width() - (t.pageX - this.document.scrollLeft()) < i.scrollSensitivity && (r = this.document.scrollLeft(this.document.scrollLeft() + i.scrollSpeed))), r !== !1 && n.ui.ddmanager && !i.dropBehaviour && n.ui.ddmanager.prepareOffsets(this, t)), this.positionAbs = this._convertPositionTo("absolute"), this.options.axis && "y" === this.options.axis || (this.helper[0].style.left = this.position.left + "px"), this.options.axis && "x" === this.options.axis || (this.helper[0].style.top = this.position.top + "px"), e = this.items.length - 1; e >= 0; e--) if (u = this.items[e], f = u.item[0], o = this._intersectsWithPointer(u), o && u.instance === this.currentContainer && f !== this.currentItem[0] && this.placeholder[1 === o ? "next" : "prev"]()[0] !== f && !n.contains(this.placeholder[0], f) && ("semi-dynamic" === this.options.type ? !n.contains(this.element[0], f) : !0)) {
                if (this.direction = 1 === o ? "down" : "up", "pointer" !== this.options.tolerance && !this._intersectsWithSides(u)) break;
                this._rearrange(t, u);
                this._trigger("change", t, this._uiHash());
                break
            }
            return this._contactContainers(t), n.ui.ddmanager && n.ui.ddmanager.drag(this, t), this._trigger("sort", t, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
        },
        _mouseStop: function (t, i) {
            if (t) {
                if (n.ui.ddmanager && !this.options.dropBehaviour && n.ui.ddmanager.drop(this, t), this.options.revert) {
                    var e = this, f = this.placeholder.offset(), r = this.options.axis, u = {};
                    r && "x" !== r || (u.left = f.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft));
                    r && "y" !== r || (u.top = f.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop));
                    this.reverting = !0;
                    n(this.helper).animate(u, parseInt(this.options.revert, 10) || 500, function () {
                        e._clear(t)
                    })
                } else this._clear(t, i);
                return !1
            }
        },
        cancel: function () {
            if (this.dragging) {
                this._mouseUp({ target: null });
                "original" === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
                for (var t = this.containers.length - 1; t >= 0; t--) this.containers[t]._trigger("deactivate", null, this._uiHash(this)), this.containers[t].containerCache.over && (this.containers[t]._trigger("out", null, this._uiHash(this)), this.containers[t].containerCache.over = 0)
            }
            return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), "original" !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), n.extend(this, {
                helper: null,
                dragging: !1,
                reverting: !1,
                _noFinalSort: null
            }), this.domPosition.prev ? n(this.domPosition.prev).after(this.currentItem) : n(this.domPosition.parent).prepend(this.currentItem)), this
        },
        serialize: function (t) {
            var r = this._getItemsAsjQuery(t && t.connected), i = [];
            return t = t || {}, n(r).each(function () {
                var r = (n(t.item || this).attr(t.attribute || "id") || "").match(t.expression || /(.+)[\-=_](.+)/);
                r && i.push((t.key || r[1] + "[]") + "=" + (t.key && t.expression ? r[1] : r[2]))
            }), !i.length && t.key && i.push(t.key + "="), i.join("&")
        },
        toArray: function (t) {
            var r = this._getItemsAsjQuery(t && t.connected), i = [];
            return t = t || {}, r.each(function () {
                i.push(n(t.item || this).attr(t.attribute || "id") || "")
            }), i
        },
        _intersectsWith: function (n) {
            var t = this.positionAbs.left, h = t + this.helperProportions.width, i = this.positionAbs.top,
                c = i + this.helperProportions.height, r = n.left, f = r + n.width, u = n.top, e = u + n.height,
                o = this.offset.click.top, s = this.offset.click.left,
                l = "x" === this.options.axis || i + o > u && e > i + o,
                a = "y" === this.options.axis || t + s > r && f > t + s, v = l && a;
            return "pointer" === this.options.tolerance || this.options.forcePointerForContainers || "pointer" !== this.options.tolerance && this.helperProportions[this.floating ? "width" : "height"] > n[this.floating ? "width" : "height"] ? v : t + this.helperProportions.width / 2 > r && f > h - this.helperProportions.width / 2 && i + this.helperProportions.height / 2 > u && e > c - this.helperProportions.height / 2
        },
        _intersectsWithPointer: function (n) {
            var r = "x" === this.options.axis || this._isOverAxis(this.positionAbs.top + this.offset.click.top, n.top, n.height),
                u = "y" === this.options.axis || this._isOverAxis(this.positionAbs.left + this.offset.click.left, n.left, n.width),
                f = r && u, t = this._getDragVerticalDirection(), i = this._getDragHorizontalDirection();
            return f ? this.floating ? i && "right" === i || "down" === t ? 2 : 1 : t && ("down" === t ? 2 : 1) : !1
        },
        _intersectsWithSides: function (n) {
            var r = this._isOverAxis(this.positionAbs.top + this.offset.click.top, n.top + n.height / 2, n.height),
                u = this._isOverAxis(this.positionAbs.left + this.offset.click.left, n.left + n.width / 2, n.width),
                t = this._getDragVerticalDirection(), i = this._getDragHorizontalDirection();
            return this.floating && i ? "right" === i && u || "left" === i && !u : t && ("down" === t && r || "up" === t && !r)
        },
        _getDragVerticalDirection: function () {
            var n = this.positionAbs.top - this.lastPositionAbs.top;
            return 0 !== n && (n > 0 ? "down" : "up")
        },
        _getDragHorizontalDirection: function () {
            var n = this.positionAbs.left - this.lastPositionAbs.left;
            return 0 !== n && (n > 0 ? "right" : "left")
        },
        refresh: function (n) {
            return this._refreshItems(n), this._setHandleClassName(), this.refreshPositions(), this
        },
        _connectWith: function () {
            var n = this.options;
            return n.connectWith.constructor === String ? [n.connectWith] : n.connectWith
        },
        _getItemsAsjQuery: function (t) {
            function h() {
                s.push(this)
            }

            var r, u, e, i, s = [], f = [], o = this._connectWith();
            if (o && t) for (r = o.length - 1; r >= 0; r--) for (e = n(o[r], this.document[0]), u = e.length - 1; u >= 0; u--) i = n.data(e[u], this.widgetFullName), i && i !== this && !i.options.disabled && f.push([n.isFunction(i.options.items) ? i.options.items.call(i.element) : n(i.options.items, i.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), i]);
            for (f.push([n.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                options: this.options,
                item: this.currentItem
            }) : n(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]), r = f.length - 1; r >= 0; r--) f[r][0].each(h);
            return n(s)
        },
        _removeCurrentsFromItems: function () {
            var t = this.currentItem.find(":data(" + this.widgetName + "-item)");
            this.items = n.grep(this.items, function (n) {
                for (var i = 0; t.length > i; i++) if (t[i] === n.item[0]) return !1;
                return !0
            })
        },
        _refreshItems: function (t) {
            this.items = [];
            this.containers = [this];
            var r, u, e, i, o, s, h, l, a = this.items,
                f = [[n.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, { item: this.currentItem }) : n(this.options.items, this.element), this]],
                c = this._connectWith();
            if (c && this.ready) for (r = c.length - 1; r >= 0; r--) for (e = n(c[r], this.document[0]), u = e.length - 1; u >= 0; u--) i = n.data(e[u], this.widgetFullName), i && i !== this && !i.options.disabled && (f.push([n.isFunction(i.options.items) ? i.options.items.call(i.element[0], t, { item: this.currentItem }) : n(i.options.items, i.element), i]), this.containers.push(i));
            for (r = f.length - 1; r >= 0; r--) for (o = f[r][1], s = f[r][0], u = 0, l = s.length; l > u; u++) h = n(s[u]), h.data(this.widgetName + "-item", o), a.push({
                item: h,
                instance: o,
                width: 0,
                height: 0,
                left: 0,
                top: 0
            })
        },
        refreshPositions: function (t) {
            this.floating = this.items.length ? "x" === this.options.axis || this._isFloating(this.items[0].item) : !1;
            this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
            for (var r, f, u, i = this.items.length - 1; i >= 0; i--) r = this.items[i], r.instance !== this.currentContainer && this.currentContainer && r.item[0] !== this.currentItem[0] || (f = this.options.toleranceElement ? n(this.options.toleranceElement, r.item) : r.item, t || (r.width = f.outerWidth(), r.height = f.outerHeight()), u = f.offset(), r.left = u.left, r.top = u.top);
            if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this); else for (i = this.containers.length - 1; i >= 0; i--) u = this.containers[i].element.offset(), this.containers[i].containerCache.left = u.left, this.containers[i].containerCache.top = u.top, this.containers[i].containerCache.width = this.containers[i].element.outerWidth(), this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
            return this
        },
        _createPlaceholder: function (t) {
            t = t || this;
            var r, i = t.options;
            i.placeholder && i.placeholder.constructor !== String || (r = i.placeholder, i.placeholder = {
                element: function () {
                    var u = t.currentItem[0].nodeName.toLowerCase(),
                        i = n("<" + u + ">", t.document[0]).addClass(r || t.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
                    return "tbody" === u ? t._createTrPlaceholder(t.currentItem.find("tr").eq(0), n("<tr>", t.document[0]).appendTo(i)) : "tr" === u ? t._createTrPlaceholder(t.currentItem, i) : "img" === u && i.attr("src", t.currentItem.attr("src")), r || i.css("visibility", "hidden"), i
                }, update: function (n, u) {
                    (!r || i.forcePlaceholderSize) && (u.height() || u.height(t.currentItem.innerHeight() - parseInt(t.currentItem.css("paddingTop") || 0, 10) - parseInt(t.currentItem.css("paddingBottom") || 0, 10)), u.width() || u.width(t.currentItem.innerWidth() - parseInt(t.currentItem.css("paddingLeft") || 0, 10) - parseInt(t.currentItem.css("paddingRight") || 0, 10)))
                }
            });
            t.placeholder = n(i.placeholder.element.call(t.element, t.currentItem));
            t.currentItem.after(t.placeholder);
            i.placeholder.update(t, t.placeholder)
        },
        _createTrPlaceholder: function (t, i) {
            var r = this;
            t.children().each(function () {
                n("<td>&#160;<\/td>", r.document[0]).attr("colspan", n(this).attr("colspan") || 1).appendTo(i)
            })
        },
        _contactContainers: function (t) {
            for (var u, c, f, a, v, o, l, s, h, e = null, i = null, r = this.containers.length - 1; r >= 0; r--) if (!n.contains(this.currentItem[0], this.containers[r].element[0])) if (this._intersectsWith(this.containers[r].containerCache)) {
                if (e && n.contains(this.containers[r].element[0], e.element[0])) continue;
                e = this.containers[r];
                i = r
            } else this.containers[r].containerCache.over && (this.containers[r]._trigger("out", t, this._uiHash(this)), this.containers[r].containerCache.over = 0);
            if (e) if (1 === this.containers.length) this.containers[i].containerCache.over || (this.containers[i]._trigger("over", t, this._uiHash(this)), this.containers[i].containerCache.over = 1); else {
                for (c = 1e4, f = null, s = e.floating || this._isFloating(this.currentItem), a = s ? "left" : "top", v = s ? "width" : "height", h = s ? "clientX" : "clientY", u = this.items.length - 1; u >= 0; u--) n.contains(this.containers[i].element[0], this.items[u].item[0]) && this.items[u].item[0] !== this.currentItem[0] && (o = this.items[u].item.offset()[a], l = !1, t[h] - o > this.items[u][v] / 2 && (l = !0), c > Math.abs(t[h] - o) && (c = Math.abs(t[h] - o), f = this.items[u], this.direction = l ? "up" : "down"));
                if (!f && !this.options.dropOnEmpty) return;
                if (this.currentContainer === this.containers[i]) return this.currentContainer.containerCache.over || (this.containers[i]._trigger("over", t, this._uiHash()), this.currentContainer.containerCache.over = 1), void 0;
                f ? this._rearrange(t, f, null, !0) : this._rearrange(t, null, this.containers[i].element, !0);
                this._trigger("change", t, this._uiHash());
                this.containers[i]._trigger("change", t, this._uiHash(this));
                this.currentContainer = this.containers[i];
                this.options.placeholder.update(this.currentContainer, this.placeholder);
                this.containers[i]._trigger("over", t, this._uiHash(this));
                this.containers[i].containerCache.over = 1
            }
        },
        _createHelper: function (t) {
            var r = this.options,
                i = n.isFunction(r.helper) ? n(r.helper.apply(this.element[0], [t, this.currentItem])) : "clone" === r.helper ? this.currentItem.clone() : this.currentItem;
            return i.parents("body").length || n("parent" !== r.appendTo ? r.appendTo : this.currentItem[0].parentNode)[0].appendChild(i[0]), i[0] === this.currentItem[0] && (this._storedCSS = {
                width: this.currentItem[0].style.width,
                height: this.currentItem[0].style.height,
                position: this.currentItem.css("position"),
                top: this.currentItem.css("top"),
                left: this.currentItem.css("left")
            }), (!i[0].style.width || r.forceHelperSize) && i.width(this.currentItem.width()), (!i[0].style.height || r.forceHelperSize) && i.height(this.currentItem.height()), i
        },
        _adjustOffsetFromHelper: function (t) {
            "string" == typeof t && (t = t.split(" "));
            n.isArray(t) && (t = { left: +t[0], top: +t[1] || 0 });
            "left" in t && (this.offset.click.left = t.left + this.margins.left);
            "right" in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left);
            "top" in t && (this.offset.click.top = t.top + this.margins.top);
            "bottom" in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _getParentOffset: function () {
            this.offsetParent = this.helper.offsetParent();
            var t = this.offsetParent.offset();
            return "absolute" === this.cssPosition && this.scrollParent[0] !== this.document[0] && n.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()), (this.offsetParent[0] === this.document[0].body || this.offsetParent[0].tagName && "html" === this.offsetParent[0].tagName.toLowerCase() && n.ui.ie) && (t = {
                top: 0,
                left: 0
            }), {
                    top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                    left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
                }
        },
        _getRelativeOffset: function () {
            if ("relative" === this.cssPosition) {
                var n = this.currentItem.position();
                return {
                    top: n.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                    left: n.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                }
            }
            return { top: 0, left: 0 }
        },
        _cacheMargins: function () {
            this.margins = {
                left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                top: parseInt(this.currentItem.css("marginTop"), 10) || 0
            }
        },
        _cacheHelperProportions: function () {
            this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() }
        },
        _setContainment: function () {
            var t, r, u, i = this.options;
            "parent" === i.containment && (i.containment = this.helper[0].parentNode);
            ("document" === i.containment || "window" === i.containment) && (this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, "document" === i.containment ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left, ("document" === i.containment ? this.document.width() : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]);
            /^(document|window|parent)$/.test(i.containment) || (t = n(i.containment)[0], r = n(i.containment).offset(), u = "hidden" !== n(t).css("overflow"), this.containment = [r.left + (parseInt(n(t).css("borderLeftWidth"), 10) || 0) + (parseInt(n(t).css("paddingLeft"), 10) || 0) - this.margins.left, r.top + (parseInt(n(t).css("borderTopWidth"), 10) || 0) + (parseInt(n(t).css("paddingTop"), 10) || 0) - this.margins.top, r.left + (u ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) - (parseInt(n(t).css("borderLeftWidth"), 10) || 0) - (parseInt(n(t).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, r.top + (u ? Math.max(t.scrollHeight, t.offsetHeight) : t.offsetHeight) - (parseInt(n(t).css("borderTopWidth"), 10) || 0) - (parseInt(n(t).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top])
        },
        _convertPositionTo: function (t, i) {
            i || (i = this.position);
            var r = "absolute" === t ? 1 : -1,
                u = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && n.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
                f = /(html|body)/i.test(u[0].tagName);
            return {
                top: i.top + this.offset.relative.top * r + this.offset.parent.top * r - ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : f ? 0 : u.scrollTop()) * r,
                left: i.left + this.offset.relative.left * r + this.offset.parent.left * r - ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : f ? 0 : u.scrollLeft()) * r
            }
        },
        _generatePosition: function (t) {
            var r, u, i = this.options, f = t.pageX, e = t.pageY,
                o = "absolute" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && n.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
                s = /(html|body)/i.test(o[0].tagName);
            return "relative" !== this.cssPosition || this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()), this.originalPosition && (this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (f = this.containment[0] + this.offset.click.left), t.pageY - this.offset.click.top < this.containment[1] && (e = this.containment[1] + this.offset.click.top), t.pageX - this.offset.click.left > this.containment[2] && (f = this.containment[2] + this.offset.click.left), t.pageY - this.offset.click.top > this.containment[3] && (e = this.containment[3] + this.offset.click.top)), i.grid && (r = this.originalPageY + Math.round((e - this.originalPageY) / i.grid[1]) * i.grid[1], e = this.containment ? r - this.offset.click.top >= this.containment[1] && r - this.offset.click.top <= this.containment[3] ? r : r - this.offset.click.top >= this.containment[1] ? r - i.grid[1] : r + i.grid[1] : r, u = this.originalPageX + Math.round((f - this.originalPageX) / i.grid[0]) * i.grid[0], f = this.containment ? u - this.offset.click.left >= this.containment[0] && u - this.offset.click.left <= this.containment[2] ? u : u - this.offset.click.left >= this.containment[0] ? u - i.grid[0] : u + i.grid[0] : u)), {
                top: e - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ("fixed" === this.cssPosition ? -this.scrollParent.scrollTop() : s ? 0 : o.scrollTop()),
                left: f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ("fixed" === this.cssPosition ? -this.scrollParent.scrollLeft() : s ? 0 : o.scrollLeft())
            }
        },
        _rearrange: function (n, t, i, r) {
            i ? i[0].appendChild(this.placeholder[0]) : t.item[0].parentNode.insertBefore(this.placeholder[0], "down" === this.direction ? t.item[0] : t.item[0].nextSibling);
            this.counter = this.counter ? ++this.counter : 1;
            var u = this.counter;
            this._delay(function () {
                u === this.counter && this.refreshPositions(!r)
            })
        },
        _clear: function (n, t) {
            function u(n, t, i) {
                return function (r) {
                    i._trigger(n, r, t._uiHash(t))
                }
            }

            this.reverting = !1;
            var i, r = [];
            if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
                for (i in this._storedCSS) ("auto" === this._storedCSS[i] || "static" === this._storedCSS[i]) && (this._storedCSS[i] = "");
                this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
            } else this.currentItem.show();
            for (this.fromOutside && !t && r.push(function (n) {
                this._trigger("receive", n, this._uiHash(this.fromOutside))
            }), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not(".ui-sortable-helper")[0] && this.domPosition.parent === this.currentItem.parent()[0] || t || r.push(function (n) {
                this._trigger("update", n, this._uiHash())
            }), this !== this.currentContainer && (t || (r.push(function (n) {
                this._trigger("remove", n, this._uiHash())
            }), r.push(function (n) {
                return function (t) {
                    n._trigger("receive", t, this._uiHash(this))
                }
            }.call(this, this.currentContainer)), r.push(function (n) {
                return function (t) {
                    n._trigger("update", t, this._uiHash(this))
                }
            }.call(this, this.currentContainer)))), i = this.containers.length - 1; i >= 0; i--) t || r.push(u("deactivate", this, this.containers[i])), this.containers[i].containerCache.over && (r.push(u("out", this, this.containers[i])), this.containers[i].containerCache.over = 0);
            if (this.storedCursor && (this.document.find("body").css("cursor", this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", "auto" === this._storedZIndex ? "" : this._storedZIndex), this.dragging = !1, t || this._trigger("beforeStop", n, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.cancelHelperRemoval || (this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null), !t) {
                for (i = 0; r.length > i; i++) r[i].call(this, n);
                this._trigger("stop", n, this._uiHash())
            }
            return this.fromOutside = !1, !this.cancelHelperRemoval
        },
        _trigger: function () {
            n.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
        },
        _uiHash: function (t) {
            var i = t || this;
            return {
                helper: i.helper,
                placeholder: i.placeholder || n([]),
                position: i.position,
                originalPosition: i.originalPosition,
                offset: i.positionAbs,
                item: i.currentItem,
                sender: t ? t.element : null
            }
        }
    });
    n.widget("ui.spinner", {
        version: "1.11.4",
        defaultElement: "<input>",
        widgetEventPrefix: "spin",
        options: {
            culture: null,
            icons: { down: "ui-icon-triangle-1-s", up: "ui-icon-triangle-1-n" },
            incremental: !0,
            max: null,
            min: null,
            numberFormat: null,
            page: 10,
            step: 1,
            change: null,
            spin: null,
            start: null,
            stop: null
        },
        _create: function () {
            this._setOption("max", this.options.max);
            this._setOption("min", this.options.min);
            this._setOption("step", this.options.step);
            "" !== this.value() && this._value(this.element.val(), !0);
            this._draw();
            this._on(this._events);
            this._refresh();
            this._on(this.window, {
                beforeunload: function () {
                    this.element.removeAttr("autocomplete")
                }
            })
        },
        _getCreateOptions: function () {
            var t = {}, i = this.element;
            return n.each(["min", "max", "step"], function (n, r) {
                var u = i.attr(r);
                void 0 !== u && u.length && (t[r] = u)
            }), t
        },
        _events: {
            keydown: function (n) {
                this._start(n) && this._keydown(n) && n.preventDefault()
            }, keyup: "_stop", focus: function () {
                this.previous = this.element.val()
            }, blur: function (n) {
                return this.cancelBlur ? (delete this.cancelBlur, void 0) : (this._stop(), this._refresh(), this.previous !== this.element.val() && this._trigger("change", n), void 0)
            }, mousewheel: function (n, t) {
                if (t) {
                    if (!this.spinning && !this._start(n)) return !1;
                    this._spin((t > 0 ? 1 : -1) * this.options.step, n);
                    clearTimeout(this.mousewheelTimer);
                    this.mousewheelTimer = this._delay(function () {
                        this.spinning && this._stop(n)
                    }, 100);
                    n.preventDefault()
                }
            }, "mousedown .ui-spinner-button": function (t) {
                function r() {
                    var n = this.element[0] === this.document[0].activeElement;
                    n || (this.element.focus(), this.previous = i, this._delay(function () {
                        this.previous = i
                    }))
                }

                var i;
                i = this.element[0] === this.document[0].activeElement ? this.previous : this.element.val();
                t.preventDefault();
                r.call(this);
                this.cancelBlur = !0;
                this._delay(function () {
                    delete this.cancelBlur;
                    r.call(this)
                });
                this._start(t) !== !1 && this._repeat(null, n(t.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, t)
            }, "mouseup .ui-spinner-button": "_stop", "mouseenter .ui-spinner-button": function (t) {
                if (n(t.currentTarget).hasClass("ui-state-active")) return this._start(t) === !1 ? !1 : (this._repeat(null, n(t.currentTarget).hasClass("ui-spinner-up") ? 1 : -1, t), void 0)
            }, "mouseleave .ui-spinner-button": "_stop"
        },
        _draw: function () {
            var n = this.uiSpinner = this.element.addClass("ui-spinner-input").attr("autocomplete", "off").wrap(this._uiSpinnerHtml()).parent().append(this._buttonHtml());
            this.element.attr("role", "spinbutton");
            this.buttons = n.find(".ui-spinner-button").attr("tabIndex", -1).button().removeClass("ui-corner-all");
            this.buttons.height() > Math.ceil(.5 * n.height()) && n.height() > 0 && n.height(n.height());
            this.options.disabled && this.disable()
        },
        _keydown: function (t) {
            var r = this.options, i = n.ui.keyCode;
            switch (t.keyCode) {
                case i.UP:
                    return this._repeat(null, 1, t), !0;
                case i.DOWN:
                    return this._repeat(null, -1, t), !0;
                case i.PAGE_UP:
                    return this._repeat(null, r.page, t), !0;
                case i.PAGE_DOWN:
                    return this._repeat(null, -r.page, t), !0
            }
            return !1
        },
        _uiSpinnerHtml: function () {
            return "<span class='ui-spinner ui-widget ui-widget-content ui-corner-all'><\/span>"
        },
        _buttonHtml: function () {
            return "<a class='ui-spinner-button ui-spinner-up ui-corner-tr'><span class='ui-icon " + this.options.icons.up + "'>&#9650;<\/span><\/a><a class='ui-spinner-button ui-spinner-down ui-corner-br'><span class='ui-icon " + this.options.icons.down + "'>&#9660;<\/span><\/a>"
        },
        _start: function (n) {
            return this.spinning || this._trigger("start", n) !== !1 ? (this.counter || (this.counter = 1), this.spinning = !0, !0) : !1
        },
        _repeat: function (n, t, i) {
            n = n || 500;
            clearTimeout(this.timer);
            this.timer = this._delay(function () {
                this._repeat(40, t, i)
            }, n);
            this._spin(t * this.options.step, i)
        },
        _spin: function (n, t) {
            var i = this.value() || 0;
            this.counter || (this.counter = 1);
            i = this._adjustValue(i + n * this._increment(this.counter));
            this.spinning && this._trigger("spin", t, { value: i }) === !1 || (this._value(i), this.counter++)
        },
        _increment: function (t) {
            var i = this.options.incremental;
            return i ? n.isFunction(i) ? i(t) : Math.floor(t * t * t / 5e4 - t * t / 500 + 17 * t / 200 + 1) : 1
        },
        _precision: function () {
            var n = this._precisionOf(this.options.step);
            return null !== this.options.min && (n = Math.max(n, this._precisionOf(this.options.min))), n
        },
        _precisionOf: function (n) {
            var t = "" + n, i = t.indexOf(".");
            return -1 === i ? 0 : t.length - i - 1
        },
        _adjustValue: function (n) {
            var r, i, t = this.options;
            return r = null !== t.min ? t.min : 0, i = n - r, i = Math.round(i / t.step) * t.step, n = r + i, n = parseFloat(n.toFixed(this._precision())), null !== t.max && n > t.max ? t.max : null !== t.min && t.min > n ? t.min : n
        },
        _stop: function (n) {
            this.spinning && (clearTimeout(this.timer), clearTimeout(this.mousewheelTimer), this.counter = 0, this.spinning = !1, this._trigger("stop", n))
        },
        _setOption: function (n, t) {
            if ("culture" === n || "numberFormat" === n) {
                var i = this._parse(this.element.val());
                return this.options[n] = t, this.element.val(this._format(i)), void 0
            }
            ("max" === n || "min" === n || "step" === n) && "string" == typeof t && (t = this._parse(t));
            "icons" === n && (this.buttons.first().find(".ui-icon").removeClass(this.options.icons.up).addClass(t.up), this.buttons.last().find(".ui-icon").removeClass(this.options.icons.down).addClass(t.down));
            this._super(n, t);
            "disabled" === n && (this.widget().toggleClass("ui-state-disabled", !!t), this.element.prop("disabled", !!t), this.buttons.button(t ? "disable" : "enable"))
        },
        _setOptions: t(function (n) {
            this._super(n)
        }),
        _parse: function (n) {
            return "string" == typeof n && "" !== n && (n = window.Globalize && this.options.numberFormat ? Globalize.parseFloat(n, 10, this.options.culture) : +n), "" === n || isNaN(n) ? null : n
        },
        _format: function (n) {
            return "" === n ? "" : window.Globalize && this.options.numberFormat ? Globalize.format(n, this.options.numberFormat, this.options.culture) : n
        },
        _refresh: function () {
            this.element.attr({
                "aria-valuemin": this.options.min,
                "aria-valuemax": this.options.max,
                "aria-valuenow": this._parse(this.element.val())
            })
        },
        isValid: function () {
            var n = this.value();
            return null === n ? !1 : n === this._adjustValue(n)
        },
        _value: function (n, t) {
            var i;
            "" !== n && (i = this._parse(n), null !== i && (t || (i = this._adjustValue(i)), n = this._format(i)));
            this.element.val(n);
            this._refresh()
        },
        _destroy: function () {
            this.element.removeClass("ui-spinner-input").prop("disabled", !1).removeAttr("autocomplete").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");
            this.uiSpinner.replaceWith(this.element)
        },
        stepUp: t(function (n) {
            this._stepUp(n)
        }),
        _stepUp: function (n) {
            this._start() && (this._spin((n || 1) * this.options.step), this._stop())
        },
        stepDown: t(function (n) {
            this._stepDown(n)
        }),
        _stepDown: function (n) {
            this._start() && (this._spin((n || 1) * -this.options.step), this._stop())
        },
        pageUp: t(function (n) {
            this._stepUp((n || 1) * this.options.page)
        }),
        pageDown: t(function (n) {
            this._stepDown((n || 1) * this.options.page)
        }),
        value: function (n) {
            return arguments.length ? (t(this._value).call(this, n), void 0) : this._parse(this.element.val())
        },
        widget: function () {
            return this.uiSpinner
        }
    });
    n.widget("ui.tabs", {
        version: "1.11.4",
        delay: 300,
        options: {
            active: null,
            collapsible: !1,
            event: "click",
            heightStyle: "content",
            hide: null,
            show: null,
            activate: null,
            beforeActivate: null,
            beforeLoad: null,
            load: null
        },
        _isLocal: function () {
            var n = /#.*$/;
            return function (t) {
                var i, r;
                t = t.cloneNode(!1);
                i = t.href.replace(n, "");
                r = location.href.replace(n, "");
                try {
                    i = decodeURIComponent(i)
                } catch (u) {
                }
                try {
                    r = decodeURIComponent(r)
                } catch (u) {
                }
                return t.hash.length > 1 && i === r
            }
        }(),
        _create: function () {
            var i = this, t = this.options;
            this.running = !1;
            this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", t.collapsible);
            this._processTabs();
            t.active = this._initialActive();
            n.isArray(t.disabled) && (t.disabled = n.unique(t.disabled.concat(n.map(this.tabs.filter(".ui-state-disabled"), function (n) {
                return i.tabs.index(n)
            }))).sort());
            this.active = this.options.active !== !1 && this.anchors.length ? this._findActive(t.active) : n();
            this._refresh();
            this.active.length && this.load(t.active)
        },
        _initialActive: function () {
            var t = this.options.active, i = this.options.collapsible, r = location.hash.substring(1);
            return null === t && (r && this.tabs.each(function (i, u) {
                if (n(u).attr("aria-controls") === r) return (t = i, !1)
            }), null === t && (t = this.tabs.index(this.tabs.filter(".ui-tabs-active"))), (null === t || -1 === t) && (t = this.tabs.length ? 0 : !1)), t !== !1 && (t = this.tabs.index(this.tabs.eq(t)), -1 === t && (t = i ? !1 : 0)), !i && t === !1 && this.anchors.length && (t = 0), t
        },
        _getCreateEventData: function () {
            return { tab: this.active, panel: this.active.length ? this._getPanelForTab(this.active) : n() }
        },
        _tabKeydown: function (t) {
            var r = n(this.document[0].activeElement).closest("li"), i = this.tabs.index(r), u = !0;
            if (!this._handlePageNav(t)) {
                switch (t.keyCode) {
                    case n.ui.keyCode.RIGHT:
                    case n.ui.keyCode.DOWN:
                        i++;
                        break;
                    case n.ui.keyCode.UP:
                    case n.ui.keyCode.LEFT:
                        u = !1;
                        i--;
                        break;
                    case n.ui.keyCode.END:
                        i = this.anchors.length - 1;
                        break;
                    case n.ui.keyCode.HOME:
                        i = 0;
                        break;
                    case n.ui.keyCode.SPACE:
                        return t.preventDefault(), clearTimeout(this.activating), this._activate(i), void 0;
                    case n.ui.keyCode.ENTER:
                        return t.preventDefault(), clearTimeout(this.activating), this._activate(i === this.options.active ? !1 : i), void 0;
                    default:
                        return
                }
                t.preventDefault();
                clearTimeout(this.activating);
                i = this._focusNextTab(i, u);
                t.ctrlKey || t.metaKey || (r.attr("aria-selected", "false"), this.tabs.eq(i).attr("aria-selected", "true"), this.activating = this._delay(function () {
                    this.option("active", i)
                }, this.delay))
            }
        },
        _panelKeydown: function (t) {
            this._handlePageNav(t) || t.ctrlKey && t.keyCode === n.ui.keyCode.UP && (t.preventDefault(), this.active.focus())
        },
        _handlePageNav: function (t) {
            return t.altKey && t.keyCode === n.ui.keyCode.PAGE_UP ? (this._activate(this._focusNextTab(this.options.active - 1, !1)), !0) : t.altKey && t.keyCode === n.ui.keyCode.PAGE_DOWN ? (this._activate(this._focusNextTab(this.options.active + 1, !0)), !0) : void 0
        },
        _findNextTab: function (t, i) {
            function u() {
                return t > r && (t = 0), 0 > t && (t = r), t
            }

            for (var r = this.tabs.length - 1; -1 !== n.inArray(u(), this.options.disabled);) t = i ? t + 1 : t - 1;
            return t
        },
        _focusNextTab: function (n, t) {
            return n = this._findNextTab(n, t), this.tabs.eq(n).focus(), n
        },
        _setOption: function (n, t) {
            return "active" === n ? (this._activate(t), void 0) : "disabled" === n ? (this._setupDisabled(t), void 0) : (this._super(n, t), "collapsible" === n && (this.element.toggleClass("ui-tabs-collapsible", t), t || this.options.active !== !1 || this._activate(0)), "event" === n && this._setupEvents(t), "heightStyle" === n && this._setupHeightStyle(t), void 0)
        },
        _sanitizeSelector: function (n) {
            return n ? n.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : ""
        },
        refresh: function () {
            var t = this.options, i = this.tablist.children(":has(a[href])");
            t.disabled = n.map(i.filter(".ui-state-disabled"), function (n) {
                return i.index(n)
            });
            this._processTabs();
            t.active !== !1 && this.anchors.length ? this.active.length && !n.contains(this.tablist[0], this.active[0]) ? this.tabs.length === t.disabled.length ? (t.active = !1, this.active = n()) : this._activate(this._findNextTab(Math.max(0, t.active - 1), !1)) : t.active = this.tabs.index(this.active) : (t.active = !1, this.active = n());
            this._refresh()
        },
        _refresh: function () {
            this._setupDisabled(this.options.disabled);
            this._setupEvents(this.options.event);
            this._setupHeightStyle(this.options.heightStyle);
            this.tabs.not(this.active).attr({ "aria-selected": "false", "aria-expanded": "false", tabIndex: -1 });
            this.panels.not(this._getPanelForTab(this.active)).hide().attr({ "aria-hidden": "true" });
            this.active.length ? (this.active.addClass("ui-tabs-active ui-state-active").attr({
                "aria-selected": "true",
                "aria-expanded": "true",
                tabIndex: 0
            }), this._getPanelForTab(this.active).show().attr({ "aria-hidden": "false" })) : this.tabs.eq(0).attr("tabIndex", 0)
        },
        _processTabs: function () {
            var t = this, i = this.tabs, r = this.anchors, u = this.panels;
            this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist").delegate("> li", "mousedown" + this.eventNamespace, function (t) {
                n(this).is(".ui-state-disabled") && t.preventDefault()
            }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function () {
                n(this).closest("li").is(".ui-state-disabled") && this.blur()
            });
            this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
                role: "tab",
                tabIndex: -1
            });
            this.anchors = this.tabs.map(function () {
                return n("a", this)[0]
            }).addClass("ui-tabs-anchor").attr({ role: "presentation", tabIndex: -1 });
            this.panels = n();
            this.anchors.each(function (i, r) {
                var f, u, e, s = n(r).uniqueId().attr("id"), o = n(r).closest("li"), h = o.attr("aria-controls");
                t._isLocal(r) ? (f = r.hash, e = f.substring(1), u = t.element.find(t._sanitizeSelector(f))) : (e = o.attr("aria-controls") || n({}).uniqueId()[0].id, f = "#" + e, u = t.element.find(f), u.length || (u = t._createPanel(e), u.insertAfter(t.panels[i - 1] || t.tablist)), u.attr("aria-live", "polite"));
                u.length && (t.panels = t.panels.add(u));
                h && o.data("ui-tabs-aria-controls", h);
                o.attr({ "aria-controls": e, "aria-labelledby": s });
                u.attr("aria-labelledby", s)
            });
            this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel");
            i && (this._off(i.not(this.tabs)), this._off(r.not(this.anchors)), this._off(u.not(this.panels)))
        },
        _getList: function () {
            return this.tablist || this.element.find("ol,ul").eq(0)
        },
        _createPanel: function (t) {
            return n("<div>").attr("id", t).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", !0)
        },
        _setupDisabled: function (t) {
            n.isArray(t) && (t.length ? t.length === this.anchors.length && (t = !0) : t = !1);
            for (var i, r = 0; i = this.tabs[r]; r++) t === !0 || -1 !== n.inArray(r, t) ? n(i).addClass("ui-state-disabled").attr("aria-disabled", "true") : n(i).removeClass("ui-state-disabled").removeAttr("aria-disabled");
            this.options.disabled = t
        },
        _setupEvents: function (t) {
            var i = {};
            t && n.each(t.split(" "), function (n, t) {
                i[t] = "_eventHandler"
            });
            this._off(this.anchors.add(this.tabs).add(this.panels));
            this._on(!0, this.anchors, {
                click: function (n) {
                    n.preventDefault()
                }
            });
            this._on(this.anchors, i);
            this._on(this.tabs, { keydown: "_tabKeydown" });
            this._on(this.panels, { keydown: "_panelKeydown" });
            this._focusable(this.tabs);
            this._hoverable(this.tabs)
        },
        _setupHeightStyle: function (t) {
            var i, r = this.element.parent();
            "fill" === t ? (i = r.height(), i -= this.element.outerHeight() - this.element.height(), this.element.siblings(":visible").each(function () {
                var t = n(this), r = t.css("position");
                "absolute" !== r && "fixed" !== r && (i -= t.outerHeight(!0))
            }), this.element.children().not(this.panels).each(function () {
                i -= n(this).outerHeight(!0)
            }), this.panels.each(function () {
                n(this).height(Math.max(0, i - n(this).innerHeight() + n(this).height()))
            }).css("overflow", "auto")) : "auto" === t && (i = 0, this.panels.each(function () {
                i = Math.max(i, n(this).height("").height())
            }).height(i))
        },
        _eventHandler: function (t) {
            var u = this.options, r = this.active, c = n(t.currentTarget), i = c.closest("li"), f = i[0] === r[0],
                e = f && u.collapsible, o = e ? n() : this._getPanelForTab(i),
                s = r.length ? this._getPanelForTab(r) : n(),
                h = { oldTab: r, oldPanel: s, newTab: e ? n() : i, newPanel: o };
            t.preventDefault();
            i.hasClass("ui-state-disabled") || i.hasClass("ui-tabs-loading") || this.running || f && !u.collapsible || this._trigger("beforeActivate", t, h) === !1 || (u.active = e ? !1 : this.tabs.index(i), this.active = f ? n() : i, this.xhr && this.xhr.abort(), s.length || o.length || n.error("jQuery UI Tabs: Mismatching fragment identifier."), o.length && this.load(this.tabs.index(i), t), this._toggle(t, h))
        },
        _toggle: function (t, i) {
            function e() {
                u.running = !1;
                u._trigger("activate", t, i)
            }

            function o() {
                i.newTab.closest("li").addClass("ui-tabs-active ui-state-active");
                r.length && u.options.show ? u._show(r, u.options.show, e) : (r.show(), e())
            }

            var u = this, r = i.newPanel, f = i.oldPanel;
            this.running = !0;
            f.length && this.options.hide ? this._hide(f, this.options.hide, function () {
                i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
                o()
            }) : (i.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active"), f.hide(), o());
            f.attr("aria-hidden", "true");
            i.oldTab.attr({ "aria-selected": "false", "aria-expanded": "false" });
            r.length && f.length ? i.oldTab.attr("tabIndex", -1) : r.length && this.tabs.filter(function () {
                return 0 === n(this).attr("tabIndex")
            }).attr("tabIndex", -1);
            r.attr("aria-hidden", "false");
            i.newTab.attr({ "aria-selected": "true", "aria-expanded": "true", tabIndex: 0 })
        },
        _activate: function (t) {
            var r, i = this._findActive(t);
            i[0] !== this.active[0] && (i.length || (i = this.active), r = i.find(".ui-tabs-anchor")[0], this._eventHandler({
                target: r,
                currentTarget: r,
                preventDefault: n.noop
            }))
        },
        _findActive: function (t) {
            return t === !1 ? n() : this.tabs.eq(t)
        },
        _getIndex: function (n) {
            return "string" == typeof n && (n = this.anchors.index(this.anchors.filter("[href$='" + n + "']"))), n
        },
        _destroy: function () {
            this.xhr && this.xhr.abort();
            this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");
            this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");
            this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();
            this.tablist.unbind(this.eventNamespace);
            this.tabs.add(this.panels).each(function () {
                n.data(this, "ui-tabs-destroy") ? n(this).remove() : n(this).removeClass("ui-state-default ui-state-active ui-state-disabled ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role")
            });
            this.tabs.each(function () {
                var t = n(this), i = t.data("ui-tabs-aria-controls");
                i ? t.attr("aria-controls", i).removeData("ui-tabs-aria-controls") : t.removeAttr("aria-controls")
            });
            this.panels.show();
            "content" !== this.options.heightStyle && this.panels.css("height", "")
        },
        enable: function (t) {
            var i = this.options.disabled;
            i !== !1 && (void 0 === t ? i = !1 : (t = this._getIndex(t), i = n.isArray(i) ? n.map(i, function (n) {
                return n !== t ? n : null
            }) : n.map(this.tabs, function (n, i) {
                return i !== t ? i : null
            })), this._setupDisabled(i))
        },
        disable: function (t) {
            var i = this.options.disabled;
            if (i !== !0) {
                if (void 0 === t) i = !0; else {
                    if (t = this._getIndex(t), -1 !== n.inArray(t, i)) return;
                    i = n.isArray(i) ? n.merge([t], i).sort() : [t]
                }
                this._setupDisabled(i)
            }
        },
        load: function (t, i) {
            t = this._getIndex(t);
            var u = this, r = this.tabs.eq(t), e = r.find(".ui-tabs-anchor"), f = this._getPanelForTab(r),
                o = { tab: r, panel: f }, s = function (n, t) {
                    "abort" === t && u.panels.stop(!1, !0);
                    r.removeClass("ui-tabs-loading");
                    f.removeAttr("aria-busy");
                    n === u.xhr && delete u.xhr
                };
            this._isLocal(e[0]) || (this.xhr = n.ajax(this._ajaxSettings(e, i, o)), this.xhr && "canceled" !== this.xhr.statusText && (r.addClass("ui-tabs-loading"), f.attr("aria-busy", "true"), this.xhr.done(function (n, t, r) {
                setTimeout(function () {
                    f.html(n);
                    u._trigger("load", i, o);
                    s(r, t)
                }, 1)
            }).fail(function (n, t) {
                setTimeout(function () {
                    s(n, t)
                }, 1)
            })))
        },
        _ajaxSettings: function (t, i, r) {
            var u = this;
            return {
                url: t.attr("href"), beforeSend: function (t, f) {
                    return u._trigger("beforeLoad", i, n.extend({ jqXHR: t, ajaxSettings: f }, r))
                }
            }
        },
        _getPanelForTab: function (t) {
            var i = n(t).attr("aria-controls");
            return this.element.find(this._sanitizeSelector("#" + i))
        }
    });
    n.widget("ui.tooltip", {
        version: "1.11.4", options: {
            content: function () {
                var t = n(this).attr("title") || "";
                return n("<a>").text(t).html()
            },
            hide: !0,
            items: "[title]:not([disabled])",
            position: { my: "left top+15", at: "left bottom", collision: "flipfit flip" },
            show: !0,
            tooltipClass: null,
            track: !1,
            close: null,
            open: null
        }, _addDescribedBy: function (t, i) {
            var r = (t.attr("aria-describedby") || "").split(/\s+/);
            r.push(i);
            t.data("ui-tooltip-id", i).attr("aria-describedby", n.trim(r.join(" ")))
        }, _removeDescribedBy: function (t) {
            var u = t.data("ui-tooltip-id"), i = (t.attr("aria-describedby") || "").split(/\s+/), r = n.inArray(u, i);
            -1 !== r && i.splice(r, 1);
            t.removeData("ui-tooltip-id");
            i = n.trim(i.join(" "));
            i ? t.attr("aria-describedby", i) : t.removeAttr("aria-describedby")
        }, _create: function () {
            this._on({ mouseover: "open", focusin: "open" });
            this.tooltips = {};
            this.parents = {};
            this.options.disabled && this._disable();
            this.liveRegion = n("<div>").attr({
                role: "log",
                "aria-live": "assertive",
                "aria-relevant": "additions"
            }).addClass("ui-helper-hidden-accessible").appendTo(this.document[0].body)
        }, _setOption: function (t, i) {
            var r = this;
            return "disabled" === t ? (this[i ? "_disable" : "_enable"](), this.options[t] = i, void 0) : (this._super(t, i), "content" === t && n.each(this.tooltips, function (n, t) {
                r._updateContent(t.element)
            }), void 0)
        }, _disable: function () {
            var t = this;
            n.each(this.tooltips, function (i, r) {
                var u = n.Event("blur");
                u.target = u.currentTarget = r.element[0];
                t.close(u, !0)
            });
            this.element.find(this.options.items).addBack().each(function () {
                var t = n(this);
                t.is("[title]") && t.data("ui-tooltip-title", t.attr("title")).removeAttr("title")
            })
        }, _enable: function () {
            this.element.find(this.options.items).addBack().each(function () {
                var t = n(this);
                t.data("ui-tooltip-title") && t.attr("title", t.data("ui-tooltip-title"))
            })
        }, open: function (t) {
            var r = this, i = n(t ? t.target : this.element).closest(this.options.items);
            i.length && !i.data("ui-tooltip-id") && (i.attr("title") && i.data("ui-tooltip-title", i.attr("title")), i.data("ui-tooltip-open", !0), t && "mouseover" === t.type && i.parents().each(function () {
                var i, t = n(this);
                t.data("ui-tooltip-open") && (i = n.Event("blur"), i.target = i.currentTarget = this, r.close(i, !0));
                t.attr("title") && (t.uniqueId(), r.parents[this.id] = {
                    element: this,
                    title: t.attr("title")
                }, t.attr("title", ""))
            }), this._registerCloseHandlers(t, i), this._updateContent(i, t))
        }, _updateContent: function (n, t) {
            var i, r = this.options.content, u = this, f = t ? t.type : null;
            return "string" == typeof r ? this._open(t, n, r) : (i = r.call(n[0], function (i) {
                u._delay(function () {
                    n.data("ui-tooltip-open") && (t && (t.type = f), this._open(t, n, i))
                })
            }), i && this._open(t, n, i), void 0)
        }, _open: function (t, i, r) {
            function o(n) {
                s.of = n;
                u.is(":hidden") || u.position(s)
            }

            var f, u, h, e, s = n.extend({}, this.options.position);
            if (r) {
                if (f = this._find(i)) return f.tooltip.find(".ui-tooltip-content").html(r), void 0;
                i.is("[title]") && (t && "mouseover" === t.type ? i.attr("title", "") : i.removeAttr("title"));
                f = this._tooltip(i);
                u = f.tooltip;
                this._addDescribedBy(i, u.attr("id"));
                u.find(".ui-tooltip-content").html(r);
                this.liveRegion.children().hide();
                r.clone ? (e = r.clone(), e.removeAttr("id").find("[id]").removeAttr("id")) : e = r;
                n("<div>").html(e).appendTo(this.liveRegion);
                this.options.track && t && /^mouse/.test(t.type) ? (this._on(this.document, { mousemove: o }), o(t)) : u.position(n.extend({ of: i }, this.options.position));
                u.hide();
                this._show(u, this.options.show);
                this.options.show && this.options.show.delay && (h = this.delayedShow = setInterval(function () {
                    u.is(":visible") && (o(s.of), clearInterval(h))
                }, n.fx.interval));
                this._trigger("open", t, { tooltip: u })
            }
        }, _registerCloseHandlers: function (t, i) {
            var r = {
                keyup: function (t) {
                    if (t.keyCode === n.ui.keyCode.ESCAPE) {
                        var r = n.Event(t);
                        r.currentTarget = i[0];
                        this.close(r, !0)
                    }
                }
            };
            i[0] !== this.element[0] && (r.remove = function () {
                this._removeTooltip(this._find(i).tooltip)
            });
            t && "mouseover" !== t.type || (r.mouseleave = "close");
            t && "focusin" !== t.type || (r.focusout = "close");
            this._on(!0, i, r)
        }, close: function (t) {
            var u, f = this, i = n(t ? t.currentTarget : this.element), r = this._find(i);
            return r ? (u = r.tooltip, r.closing || (clearInterval(this.delayedShow), i.data("ui-tooltip-title") && !i.attr("title") && i.attr("title", i.data("ui-tooltip-title")), this._removeDescribedBy(i), r.hiding = !0, u.stop(!0), this._hide(u, this.options.hide, function () {
                f._removeTooltip(n(this))
            }), i.removeData("ui-tooltip-open"), this._off(i, "mouseleave focusout keyup"), i[0] !== this.element[0] && this._off(i, "remove"), this._off(this.document, "mousemove"), t && "mouseleave" === t.type && n.each(this.parents, function (t, i) {
                n(i.element).attr("title", i.title);
                delete f.parents[t]
            }), r.closing = !0, this._trigger("close", t, { tooltip: u }), r.hiding || (r.closing = !1)), void 0) : (i.removeData("ui-tooltip-open"), void 0)
        }, _tooltip: function (t) {
            var i = n("<div>").attr("role", "tooltip").addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " + (this.options.tooltipClass || "")),
                r = i.uniqueId().attr("id");
            return n("<div>").addClass("ui-tooltip-content").appendTo(i), i.appendTo(this.document[0].body), this.tooltips[r] = {
                element: t,
                tooltip: i
            }
        }, _find: function (n) {
            var t = n.data("ui-tooltip-id");
            return t ? this.tooltips[t] : null
        }, _removeTooltip: function (n) {
            n.remove();
            delete this.tooltips[n.attr("id")]
        }, _destroy: function () {
            var t = this;
            n.each(this.tooltips, function (i, r) {
                var f = n.Event("blur"), u = r.element;
                f.target = f.currentTarget = u[0];
                t.close(f, !0);
                n("#" + i).remove();
                u.data("ui-tooltip-title") && (u.attr("title") || u.attr("title", u.data("ui-tooltip-title")), u.removeData("ui-tooltip-title"))
            });
            this.liveRegion.remove()
        }
    })
});
/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011�2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function (n) {
    function t(n, t) {
        if (!(n.originalEvent.touches.length > 1)) {
            n.preventDefault();
            var i = n.originalEvent.changedTouches[0], r = document.createEvent("MouseEvents");
            r.initMouseEvent(t, !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null);
            n.target.dispatchEvent(r)
        }
    }

    if (n.support.touch = "ontouchend" in document, n.support.touch) {
        var r, i = n.ui.mouse.prototype, u = i._mouseInit, f = i._mouseDestroy;
        i._touchStart = function (n) {
            var i = this;
            !r && i._mouseCapture(n.originalEvent.changedTouches[0]) && (r = !0, i._touchMoved = !1, t(n, "mouseover"), t(n, "mousemove"), t(n, "mousedown"))
        };
        i._touchMove = function (n) {
            r && (this._touchMoved = !0, t(n, "mousemove"))
        };
        i._touchEnd = function (n) {
            r && (t(n, "mouseup"), t(n, "mouseout"), this._touchMoved || t(n, "click"), r = !1)
        };
        i._mouseInit = function () {
            var t = this;
            t.element.bind({
                touchstart: n.proxy(t, "_touchStart"),
                touchmove: n.proxy(t, "_touchMove"),
                touchend: n.proxy(t, "_touchEnd")
            });
            u.call(t)
        };
        i._mouseDestroy = function () {
            var t = this;
            t.element.unbind({
                touchstart: n.proxy(t, "_touchStart"),
                touchmove: n.proxy(t, "_touchMove"),
                touchend: n.proxy(t, "_touchEnd")
            });
            f.call(t)
        }
    }
}(jQuery);
formIdleTime = 0;
$("#car-finance-form").trigger("reset");
$(document).ready(function () {
    $("#car-finance-form").trigger("reset");
    var n = setInterval(timerIncrement, 6e4);
    $(this).mousemove(function () {
        idleTime = 0
    });
    $(this).keypress(function () {
        idleTime = 0
    });
    setTimeout(function () {
        $("[data-selected]").each(function () {
            var n = $(this).attr("data-type");
            $(this).parents(".form-group").length > 0 && $(this).parents(".form-group").find('input[type="hidden"]').val(n)
        })
    }, 150)
});
$(document).ready(function () {
    $(window).resize(setAprBoxFixed).trigger("resize")
});
/*!
 * Bootstrap v3.3.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
if ("undefined" == typeof jQuery) throw new Error("Bootstrap's JavaScript requires jQuery");
+function (n) {
    var t = n.fn.jquery.split(" ")[0].split(".");
    if (t[0] < 2 && t[1] < 9 || 1 == t[0] && 9 == t[1] && t[2] < 1) throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher");
}(jQuery);
+function (n) {
    "use strict";

    function t() {
        var i = document.createElement("bootstrap"), n = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var t in n) if (void 0 !== i.style[t]) return { end: n[t] };
        return !1
    }

    n.fn.emulateTransitionEnd = function (t) {
        var i = !1, u = this, r;
        n(this).one("bsTransitionEnd", function () {
            i = !0
        });
        return r = function () {
            i || n(u).trigger(n.support.transition.end)
        }, setTimeout(r, t), this
    };
    n(function () {
        n.support.transition = t();
        n.support.transition && (n.event.special.bsTransitionEnd = {
            bindType: n.support.transition.end,
            delegateType: n.support.transition.end,
            handle: function (t) {
                if (n(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
            }
        })
    })
}(jQuery);
+function (n) {
    "use strict";

    function u(i) {
        return this.each(function () {
            var r = n(this), u = r.data("bs.alert");
            u || r.data("bs.alert", u = new t(this));
            "string" == typeof i && u[i].call(r)
        })
    }

    var i = '[data-dismiss="alert"]', t = function (t) {
        n(t).on("click", i, this.close)
    }, r;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 150;
    t.prototype.close = function (i) {
        function e() {
            r.detach().trigger("closed.bs.alert").remove()
        }

        var f = n(this), u = f.attr("data-target"), r;
        u || (u = f.attr("href"), u = u && u.replace(/.*(?=#[^\s]*$)/, ""));
        r = n(u);
        i && i.preventDefault();
        r.length || (r = f.closest(".alert"));
        r.trigger(i = n.Event("close.bs.alert"));
        i.isDefaultPrevented() || (r.removeClass("in"), n.support.transition && r.hasClass("fade") ? r.one("bsTransitionEnd", e).emulateTransitionEnd(t.TRANSITION_DURATION) : e())
    };
    r = n.fn.alert;
    n.fn.alert = u;
    n.fn.alert.Constructor = t;
    n.fn.alert.noConflict = function () {
        return n.fn.alert = r, this
    };
    n(document).on("click.bs.alert.data-api", i, t.prototype.close)
}(jQuery);
+function (n) {
    "use strict";

    function i(i) {
        return this.each(function () {
            var u = n(this), r = u.data("bs.button"), f = "object" == typeof i && i;
            r || u.data("bs.button", r = new t(this, f));
            "toggle" == i ? r.toggle() : i && r.setState(i)
        })
    }

    var t = function (i, r) {
        this.$element = n(i);
        this.options = n.extend({}, t.DEFAULTS, r);
        this.isLoading = !1
    }, r;
    t.VERSION = "3.3.1";
    t.DEFAULTS = { loadingText: "loading..." };
    t.prototype.setState = function (t) {
        var r = "disabled", i = this.$element, f = i.is("input") ? "val" : "html", u = i.data();
        t += "Text";
        null == u.resetText && i.data("resetText", i[f]());
        setTimeout(n.proxy(function () {
            i[f](null == u[t] ? this.options[t] : u[t]);
            "loadingText" == t ? (this.isLoading = !0, i.addClass(r).attr(r, r)) : this.isLoading && (this.isLoading = !1, i.removeClass(r).removeAttr(r))
        }, this), 0)
    };
    t.prototype.toggle = function () {
        var t = !0, i = this.$element.closest('[data-toggle="buttons"]'), n;
        i.length ? (n = this.$element.find("input"), "radio" == n.prop("type") && (n.prop("checked") && this.$element.hasClass("active") ? t = !1 : i.find(".active").removeClass("active")), t && n.prop("checked", !this.$element.hasClass("active")).trigger("change")) : this.$element.attr("aria-pressed", !this.$element.hasClass("active"));
        t && this.$element.toggleClass("active")
    };
    r = n.fn.button;
    n.fn.button = i;
    n.fn.button.Constructor = t;
    n.fn.button.noConflict = function () {
        return n.fn.button = r, this
    };
    n(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function (t) {
        var r = n(t.target);
        r.hasClass("btn") || (r = r.closest(".btn"));
        i.call(r, "toggle");
        t.preventDefault()
    }).on("focus.bs.button.data-api blur.bs.button.data-api", '[data-toggle^="button"]', function (t) {
        n(t.target).closest(".btn").toggleClass("focus", /^focus(in)?$/.test(t.type))
    })
}(jQuery);
+function (n) {
    "use strict";

    function i(i) {
        return this.each(function () {
            var u = n(this), r = u.data("bs.carousel"),
                f = n.extend({}, t.DEFAULTS, u.data(), "object" == typeof i && i),
                e = "string" == typeof i ? i : f.slide;
            r || u.data("bs.carousel", r = new t(this, f));
            "number" == typeof i ? r.to(i) : e ? r[e]() : f.interval && r.pause().cycle()
        })
    }

    var t = function (t, i) {
        this.$element = n(t);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = i;
        this.paused = this.sliding = this.interval = this.$active = this.$items = null;
        this.options.keyboard && this.$element.on("keydown.bs.carousel", n.proxy(this.keydown, this));
        "hover" == this.options.pause && !("ontouchstart" in document.documentElement) && this.$element.on("mouseenter.bs.carousel", n.proxy(this.pause, this)).on("mouseleave.bs.carousel", n.proxy(this.cycle, this))
    }, u, r;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 600;
    t.DEFAULTS = { interval: 5e3, pause: "hover", wrap: !0, keyboard: !0 };
    t.prototype.keydown = function (n) {
        if (!/input|textarea/i.test(n.target.tagName)) {
            switch (n.which) {
                case 37:
                    this.prev();
                    break;
                case 39:
                    this.next();
                    break;
                default:
                    return
            }
            n.preventDefault()
        }
    };
    t.prototype.cycle = function (t) {
        return t || (this.paused = !1), this.interval && clearInterval(this.interval), this.options.interval && !this.paused && (this.interval = setInterval(n.proxy(this.next, this), this.options.interval)), this
    };
    t.prototype.getItemIndex = function (n) {
        return this.$items = n.parent().children(".item"), this.$items.index(n || this.$active)
    };
    t.prototype.getItemForDirection = function (n, t) {
        var i = "prev" == n ? -1 : 1, r = this.getItemIndex(t), u = (r + i) % this.$items.length;
        return this.$items.eq(u)
    };
    t.prototype.to = function (n) {
        var i = this, t = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (!(n > this.$items.length - 1) && !(0 > n)) return this.sliding ? this.$element.one("slid.bs.carousel", function () {
            i.to(n)
        }) : t == n ? this.pause().cycle() : this.slide(n > t ? "next" : "prev", this.$items.eq(n))
    };
    t.prototype.pause = function (t) {
        return t || (this.paused = !0), this.$element.find(".next, .prev").length && n.support.transition && (this.$element.trigger(n.support.transition.end), this.cycle(!0)), this.interval = clearInterval(this.interval), this
    };
    t.prototype.next = function () {
        if (!this.sliding) return this.slide("next")
    };
    t.prototype.prev = function () {
        if (!this.sliding) return this.slide("prev")
    };
    t.prototype.slide = function (i, r) {
        var e = this.$element.find(".item.active"), u = r || this.getItemForDirection(i, e), l = this.interval,
            f = "next" == i ? "left" : "right", v = "next" == i ? "first" : "last", a = this, o, s, h, c;
        if (!u.length) {
            if (!this.options.wrap) return;
            u = this.$element.find(".item")[v]()
        }
        return u.hasClass("active") ? this.sliding = !1 : (o = u[0], s = n.Event("slide.bs.carousel", {
            relatedTarget: o,
            direction: f
        }), (this.$element.trigger(s), !s.isDefaultPrevented()) ? ((this.sliding = !0, l && this.pause(), this.$indicators.length) && (this.$indicators.find(".active").removeClass("active"), h = n(this.$indicators.children()[this.getItemIndex(u)]), h && h.addClass("active")), c = n.Event("slid.bs.carousel", {
            relatedTarget: o,
            direction: f
        }), n.support.transition && this.$element.hasClass("slide") ? (u.addClass(i), u[0].offsetWidth, e.addClass(f), u.addClass(f), e.one("bsTransitionEnd", function () {
            u.removeClass([i, f].join(" ")).addClass("active");
            e.removeClass(["active", f].join(" "));
            a.sliding = !1;
            setTimeout(function () {
                a.$element.trigger(c)
            }, 0)
        }).emulateTransitionEnd(t.TRANSITION_DURATION)) : (e.removeClass("active"), u.addClass("active"), this.sliding = !1, this.$element.trigger(c)), l && this.cycle(), this) : void 0)
    };
    u = n.fn.carousel;
    n.fn.carousel = i;
    n.fn.carousel.Constructor = t;
    n.fn.carousel.noConflict = function () {
        return n.fn.carousel = u, this
    };
    r = function (t) {
        var o, r = n(this), u = n(r.attr("data-target") || (o = r.attr("href")) && o.replace(/.*(?=#[^\s]+$)/, "")), e,
            f;
        u.hasClass("carousel") && (e = n.extend({}, u.data(), r.data()), f = r.attr("data-slide-to"), f && (e.interval = !1), i.call(u, e), f && u.data("bs.carousel").to(f), t.preventDefault())
    };
    n(document).on("click.bs.carousel.data-api", "[data-slide]", r).on("click.bs.carousel.data-api", "[data-slide-to]", r);
    n(window).on("load", function () {
        n('[data-ride="carousel"]').each(function () {
            var t = n(this);
            i.call(t, t.data())
        })
    })
}(jQuery);
+function (n) {
    "use strict";

    function r(t) {
        var i, r = t.attr("data-target") || (i = t.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "");
        return n(r)
    }

    function i(i) {
        return this.each(function () {
            var u = n(this), r = u.data("bs.collapse"),
                f = n.extend({}, t.DEFAULTS, u.data(), "object" == typeof i && i);
            !r && f.toggle && "show" == i && (f.toggle = !1);
            r || u.data("bs.collapse", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    }

    var t = function (i, r) {
        this.$element = n(i);
        this.options = n.extend({}, t.DEFAULTS, r);
        this.$trigger = n(this.options.trigger).filter('[href="#' + i.id + '"], [data-target="#' + i.id + '"]');
        this.transitioning = null;
        this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger);
        this.options.toggle && this.toggle()
    }, u;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 350;
    t.DEFAULTS = { toggle: !0, trigger: '[data-toggle="collapse"]' };
    t.prototype.dimension = function () {
        var n = this.$element.hasClass("width");
        return n ? "width" : "height"
    };
    t.prototype.show = function () {
        var f, r, e, u, o, s;
        if (!this.transitioning && !this.$element.hasClass("in") && (r = this.$parent && this.$parent.find("> .panel").children(".in, .collapsing"), !(r && r.length && (f = r.data("bs.collapse"), f && f.transitioning)) && (e = n.Event("show.bs.collapse"), this.$element.trigger(e), !e.isDefaultPrevented()))) {
            if (r && r.length && (i.call(r, "hide"), f || r.data("bs.collapse", null)), u = this.dimension(), this.$element.removeClass("collapse").addClass("collapsing")[u](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1, o = function () {
                this.$element.removeClass("collapsing").addClass("collapse in")[u]("");
                this.transitioning = 0;
                this.$element.trigger("shown.bs.collapse")
            }, !n.support.transition) return o.call(this);
            s = n.camelCase(["scroll", u].join("-"));
            this.$element.one("bsTransitionEnd", n.proxy(o, this)).emulateTransitionEnd(t.TRANSITION_DURATION)[u](this.$element[0][s])
        }
    };
    t.prototype.hide = function () {
        var r, i, u;
        if (!this.transitioning && this.$element.hasClass("in") && (r = n.Event("hide.bs.collapse"), this.$element.trigger(r), !r.isDefaultPrevented())) return i = this.dimension(), this.$element[i](this.$element[i]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1, u = function () {
            this.transitioning = 0;
            this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
        }, n.support.transition ? void this.$element[i](0).one("bsTransitionEnd", n.proxy(u, this)).emulateTransitionEnd(t.TRANSITION_DURATION) : u.call(this)
    };
    t.prototype.toggle = function () {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    };
    t.prototype.getParent = function () {
        return n(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(n.proxy(function (t, i) {
            var u = n(i);
            this.addAriaAndCollapsedClass(r(u), u)
        }, this)).end()
    };
    t.prototype.addAriaAndCollapsedClass = function (n, t) {
        var i = n.hasClass("in");
        n.attr("aria-expanded", i);
        t.toggleClass("collapsed", !i).attr("aria-expanded", i)
    };
    u = n.fn.collapse;
    n.fn.collapse = i;
    n.fn.collapse.Constructor = t;
    n.fn.collapse.noConflict = function () {
        return n.fn.collapse = u, this
    };
    n(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function (t) {
        var u = n(this);
        u.attr("data-target") || t.preventDefault();
        var f = r(u), e = f.data("bs.collapse"), o = e ? "toggle" : n.extend({}, u.data(), { trigger: this });
        i.call(f, o)
    })
}(jQuery);
+function (n) {
    "use strict";

    function r(t) {
        t && 3 === t.which || (n(o).remove(), n(i).each(function () {
            var r = n(this), i = u(r), f = { relatedTarget: this };
            i.hasClass("open") && (i.trigger(t = n.Event("hide.bs.dropdown", f)), t.isDefaultPrevented() || (r.attr("aria-expanded", "false"), i.removeClass("open").trigger("hidden.bs.dropdown", f)))
        }))
    }

    function u(t) {
        var i = t.attr("data-target"), r;
        return i || (i = t.attr("href"), i = i && /#[A-Za-z]/.test(i) && i.replace(/.*(?=#[^\s]*$)/, "")), r = i && n(i), r && r.length ? r : t.parent()
    }

    function e(i) {
        return this.each(function () {
            var r = n(this), u = r.data("bs.dropdown");
            u || r.data("bs.dropdown", u = new t(this));
            "string" == typeof i && u[i].call(r)
        })
    }

    var o = ".dropdown-backdrop", i = '[data-toggle="dropdown"]', t = function (t) {
        n(t).on("click.bs.dropdown", this.toggle)
    }, f;
    t.VERSION = "3.3.1";
    t.prototype.toggle = function (t) {
        var f = n(this), i, o, e;
        if (!f.is(".disabled, :disabled")) {
            if (i = u(f), o = i.hasClass("open"), r(), !o) {
                if ("ontouchstart" in document.documentElement && !i.closest(".navbar-nav").length && n('<div class="dropdown-backdrop"/>').insertAfter(n(this)).on("click", r), e = { relatedTarget: this }, i.trigger(t = n.Event("show.bs.dropdown", e)), t.isDefaultPrevented()) return;
                f.trigger("focus").attr("aria-expanded", "true");
                i.toggleClass("open").trigger("shown.bs.dropdown", e)
            }
            return !1
        }
    };
    t.prototype.keydown = function (t) {
        var e, o, s, h, f, r;
        if (/(38|40|27|32)/.test(t.which) && !/input|textarea/i.test(t.target.tagName) && (e = n(this), t.preventDefault(), t.stopPropagation(), !e.is(".disabled, :disabled"))) {
            if (o = u(e), s = o.hasClass("open"), !s && 27 != t.which || s && 27 == t.which) return 27 == t.which && o.find(i).trigger("focus"), e.trigger("click");
            h = " li:not(.divider):visible a";
            f = o.find('[role="menu"]' + h + ', [role="listbox"]' + h);
            f.length && (r = f.index(t.target), 38 == t.which && r > 0 && r-- , 40 == t.which && r < f.length - 1 && r++ , ~r || (r = 0), f.eq(r).trigger("focus"))
        }
    };
    f = n.fn.dropdown;
    n.fn.dropdown = e;
    n.fn.dropdown.Constructor = t;
    n.fn.dropdown.noConflict = function () {
        return n.fn.dropdown = f, this
    };
    n(document).on("click.bs.dropdown.data-api", r).on("click.bs.dropdown.data-api", ".dropdown form", function (n) {
        n.stopPropagation()
    }).on("click.bs.dropdown.data-api", i, t.prototype.toggle).on("keydown.bs.dropdown.data-api", i, t.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="menu"]', t.prototype.keydown).on("keydown.bs.dropdown.data-api", '[role="listbox"]', t.prototype.keydown)
}(jQuery);
+function (n) {
    "use strict";

    function i(i, r) {
        return this.each(function () {
            var f = n(this), u = f.data("bs.modal"), e = n.extend({}, t.DEFAULTS, f.data(), "object" == typeof i && i);
            u || f.data("bs.modal", u = new t(this, e));
            "string" == typeof i ? u[i](r) : e.show && u.show(r)
        })
    }

    var t = function (t, i) {
        this.options = i;
        this.$body = n(document.body);
        this.$element = n(t);
        this.$backdrop = this.isShown = null;
        this.scrollbarWidth = 0;
        this.options.remote && this.$element.find(".modal-content").load(this.options.remote, n.proxy(function () {
            this.$element.trigger("loaded.bs.modal")
        }, this))
    }, r;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 300;
    t.BACKDROP_TRANSITION_DURATION = 150;
    t.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0 };
    t.prototype.toggle = function (n) {
        return this.isShown ? this.hide() : this.show(n)
    };
    t.prototype.show = function (i) {
        var r = this, u = n.Event("show.bs.modal", { relatedTarget: i });
        this.$element.trigger(u);
        this.isShown || u.isDefaultPrevented() || (this.isShown = !0, this.checkScrollbar(), this.setScrollbar(), this.$body.addClass("modal-open"), this.escape(), this.resize(), this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', n.proxy(this.hide, this)), this.backdrop(function () {
            var f = n.support.transition && r.$element.hasClass("fade"), u;
            r.$element.parent().length || r.$element.appendTo(r.$body);
            r.$element.show().scrollTop(0);
            r.options.backdrop && r.adjustBackdrop();
            r.adjustDialog();
            f && r.$element[0].offsetWidth;
            r.$element.addClass("in").attr("aria-hidden", !1);
            r.enforceFocus();
            u = n.Event("shown.bs.modal", { relatedTarget: i });
            f ? r.$element.find(".modal-dialog").one("bsTransitionEnd", function () {
                r.$element.trigger("focus").trigger(u)
            }).emulateTransitionEnd(t.TRANSITION_DURATION) : r.$element.trigger("focus").trigger(u)
        }))
    };
    t.prototype.hide = function (i) {
        i && i.preventDefault();
        i = n.Event("hide.bs.modal");
        this.$element.trigger(i);
        this.isShown && !i.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.resize(), n(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.bs.modal"), n.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", n.proxy(this.hideModal, this)).emulateTransitionEnd(t.TRANSITION_DURATION) : this.hideModal())
    };
    t.prototype.enforceFocus = function () {
        n(document).off("focusin.bs.modal").on("focusin.bs.modal", n.proxy(function (n) {
            this.$element[0] === n.target || this.$element.has(n.target).length || this.$element.trigger("focus")
        }, this))
    };
    t.prototype.escape = function () {
        this.isShown && this.options.keyboard ? this.$element.on("keydown.dismiss.bs.modal", n.proxy(function (n) {
            27 == n.which && this.hide()
        }, this)) : this.isShown || this.$element.off("keydown.dismiss.bs.modal")
    };
    t.prototype.resize = function () {
        this.isShown ? n(window).on("resize.bs.modal", n.proxy(this.handleUpdate, this)) : n(window).off("resize.bs.modal")
    };
    t.prototype.hideModal = function () {
        var n = this;
        this.$element.hide();
        this.backdrop(function () {
            n.$body.removeClass("modal-open");
            n.resetAdjustments();
            n.resetScrollbar();
            n.$element.trigger("hidden.bs.modal")
        })
    };
    t.prototype.removeBackdrop = function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null
    };
    t.prototype.backdrop = function (i) {
        var e = this, f = this.$element.hasClass("fade") ? "fade" : "", r, u;
        if (this.isShown && this.options.backdrop) {
            if (r = n.support.transition && f, this.$backdrop = n('<div class="modal-backdrop ' + f + '" />').prependTo(this.$element).on("click.dismiss.bs.modal", n.proxy(function (n) {
                n.target === n.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            }, this)), r && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !i) return;
            r ? this.$backdrop.one("bsTransitionEnd", i).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION) : i()
        } else !this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), u = function () {
            e.removeBackdrop();
            i && i()
        }, n.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", u).emulateTransitionEnd(t.BACKDROP_TRANSITION_DURATION) : u()) : i && i()
    };
    t.prototype.handleUpdate = function () {
        this.options.backdrop && this.adjustBackdrop();
        this.adjustDialog()
    };
    t.prototype.adjustBackdrop = function () {
        this.$backdrop.css("height", 0).css("height", this.$element[0].scrollHeight)
    };
    t.prototype.adjustDialog = function () {
        var n = this.$element[0].scrollHeight > document.documentElement.clientHeight;
        this.$element.css({
            paddingLeft: !this.bodyIsOverflowing && n ? this.scrollbarWidth : "",
            paddingRight: this.bodyIsOverflowing && !n ? this.scrollbarWidth : ""
        })
    };
    t.prototype.resetAdjustments = function () {
        this.$element.css({ paddingLeft: "", paddingRight: "" })
    };
    t.prototype.checkScrollbar = function () {
        this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight;
        this.scrollbarWidth = this.measureScrollbar()
    };
    t.prototype.setScrollbar = function () {
        var n = parseInt(this.$body.css("padding-right") || 0, 10);
        this.bodyIsOverflowing && this.$body.css("padding-right", n + this.scrollbarWidth)
    };
    t.prototype.resetScrollbar = function () {
        this.$body.css("padding-right", "")
    };
    t.prototype.measureScrollbar = function () {
        var n = document.createElement("div"), t;
        return n.className = "modal-scrollbar-measure", this.$body.append(n), t = n.offsetWidth - n.clientWidth, this.$body[0].removeChild(n), t
    };
    r = n.fn.modal;
    n.fn.modal = i;
    n.fn.modal.Constructor = t;
    n.fn.modal.noConflict = function () {
        return n.fn.modal = r, this
    };
    n(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function (t) {
        var r = n(this), f = r.attr("href"), u = n(r.attr("data-target") || f && f.replace(/.*(?=#[^\s]+$)/, "")),
            e = u.data("bs.modal") ? "toggle" : n.extend({ remote: !/#/.test(f) && f }, u.data(), r.data());
        r.is("a") && t.preventDefault();
        u.one("show.bs.modal", function (n) {
            n.isDefaultPrevented() || u.one("hidden.bs.modal", function () {
                r.is(":visible") && r.trigger("focus")
            })
        });
        i.call(u, e, this)
    })
}(jQuery);
+function (n) {
    "use strict";

    function r(i) {
        return this.each(function () {
            var f = n(this), r = f.data("bs.tooltip"), u = "object" == typeof i && i, e = u && u.selector;
            (r || "destroy" != i) && (e ? (r || f.data("bs.tooltip", r = {}), r[e] || (r[e] = new t(this, u))) : r || f.data("bs.tooltip", r = new t(this, u)), "string" == typeof i && r[i]())
        })
    }

    var t = function (n, t) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
        this.init("tooltip", n, t)
    }, i;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 150;
    t.DEFAULTS = {
        animation: !0,
        placement: "top",
        selector: !1,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"><\/div><div class="tooltip-inner"><\/div><\/div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: !1,
        container: !1,
        viewport: { selector: "body", padding: 0 }
    };
    t.prototype.init = function (t, i, r) {
        var f, e, u, o, s;
        for (this.enabled = !0, this.type = t, this.$element = n(i), this.options = this.getOptions(r), this.$viewport = this.options.viewport && n(this.options.viewport.selector || this.options.viewport), f = this.options.trigger.split(" "), e = f.length; e--;) if (u = f[e], "click" == u) this.$element.on("click." + this.type, this.options.selector, n.proxy(this.toggle, this)); else "manual" != u && (o = "hover" == u ? "mouseenter" : "focusin", s = "hover" == u ? "mouseleave" : "focusout", this.$element.on(o + "." + this.type, this.options.selector, n.proxy(this.enter, this)), this.$element.on(s + "." + this.type, this.options.selector, n.proxy(this.leave, this)));
        this.options.selector ? this._options = n.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle()
    };
    t.prototype.getDefaults = function () {
        return t.DEFAULTS
    };
    t.prototype.getOptions = function (t) {
        return t = n.extend({}, this.getDefaults(), this.$element.data(), t), t.delay && "number" == typeof t.delay && (t.delay = {
            show: t.delay,
            hide: t.delay
        }), t
    };
    t.prototype.getDelegateOptions = function () {
        var t = {}, i = this.getDefaults();
        return this._options && n.each(this._options, function (n, r) {
            i[n] != r && (t[n] = r)
        }), t
    };
    t.prototype.enter = function (t) {
        var i = t instanceof this.constructor ? t : n(t.currentTarget).data("bs." + this.type);
        return i && i.$tip && i.$tip.is(":visible") ? void (i.hoverState = "in") : (i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), n(t.currentTarget).data("bs." + this.type, i)), clearTimeout(i.timeout), i.hoverState = "in", i.options.delay && i.options.delay.show ? void (i.timeout = setTimeout(function () {
            "in" == i.hoverState && i.show()
        }, i.options.delay.show)) : i.show())
    };
    t.prototype.leave = function (t) {
        var i = t instanceof this.constructor ? t : n(t.currentTarget).data("bs." + this.type);
        return i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), n(t.currentTarget).data("bs." + this.type, i)), clearTimeout(i.timeout), i.hoverState = "out", i.options.delay && i.options.delay.hide ? void (i.timeout = setTimeout(function () {
            "out" == i.hoverState && i.hide()
        }, i.options.delay.hide)) : i.hide()
    };
    t.prototype.show = function () {
        var c = n.Event("show.bs." + this.type), l, p, h;
        if (this.hasContent() && this.enabled) {
            if (this.$element.trigger(c), l = n.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]), c.isDefaultPrevented() || !l) return;
            var u = this, r = this.tip(), a = this.getUID(this.type);
            this.setContent();
            r.attr("id", a);
            this.$element.attr("aria-describedby", a);
            this.options.animation && r.addClass("fade");
            var i = "function" == typeof this.options.placement ? this.options.placement.call(this, r[0], this.$element[0]) : this.options.placement,
                v = /\s?auto?\s?/i, y = v.test(i);
            y && (i = i.replace(v, "") || "top");
            r.detach().css({ top: 0, left: 0, display: "block" }).addClass(i).data("bs." + this.type, this);
            this.options.container ? r.appendTo(this.options.container) : r.insertAfter(this.$element);
            var f = this.getPosition(), o = r[0].offsetWidth, s = r[0].offsetHeight;
            if (y) {
                var w = i, b = this.options.container ? n(this.options.container) : this.$element.parent(),
                    e = this.getPosition(b);
                i = "bottom" == i && f.bottom + s > e.bottom ? "top" : "top" == i && f.top - s < e.top ? "bottom" : "right" == i && f.right + o > e.width ? "left" : "left" == i && f.left - o < e.left ? "right" : i;
                r.removeClass(w).addClass(i)
            }
            p = this.getCalculatedOffset(i, f, o, s);
            this.applyPlacement(p, i);
            h = function () {
                var n = u.hoverState;
                u.$element.trigger("shown.bs." + u.type);
                u.hoverState = null;
                "out" == n && u.leave(u)
            };
            n.support.transition && this.$tip.hasClass("fade") ? r.one("bsTransitionEnd", h).emulateTransitionEnd(t.TRANSITION_DURATION) : h()
        }
    };
    t.prototype.applyPlacement = function (t, i) {
        var r = this.tip(), l = r[0].offsetWidth, e = r[0].offsetHeight, o = parseInt(r.css("margin-top"), 10),
            s = parseInt(r.css("margin-left"), 10), h, f, u;
        isNaN(o) && (o = 0);
        isNaN(s) && (s = 0);
        t.top = t.top + o;
        t.left = t.left + s;
        n.offset.setOffset(r[0], n.extend({
            using: function (n) {
                r.css({ top: Math.round(n.top), left: Math.round(n.left) })
            }
        }, t), 0);
        r.addClass("in");
        h = r[0].offsetWidth;
        f = r[0].offsetHeight;
        "top" == i && f != e && (t.top = t.top + e - f);
        u = this.getViewportAdjustedDelta(i, t, h, f);
        u.left ? t.left += u.left : t.top += u.top;
        var c = /top|bottom/.test(i), a = c ? 2 * u.left - l + h : 2 * u.top - e + f,
            v = c ? "offsetWidth" : "offsetHeight";
        r.offset(t);
        this.replaceArrow(a, r[0][v], c)
    };
    t.prototype.replaceArrow = function (n, t, i) {
        this.arrow().css(i ? "left" : "top", 50 * (1 - n / t) + "%").css(i ? "top" : "left", "")
    };
    t.prototype.setContent = function () {
        var n = this.tip(), t = this.getTitle();
        n.find(".tooltip-inner")[this.options.html ? "html" : "text"](t);
        n.removeClass("fade in top bottom left right")
    };
    t.prototype.hide = function (i) {
        function f() {
            "in" != r.hoverState && u.detach();
            r.$element.removeAttr("aria-describedby").trigger("hidden.bs." + r.type);
            i && i()
        }

        var r = this, u = this.tip(), e = n.Event("hide.bs." + this.type);
        return this.$element.trigger(e), e.isDefaultPrevented() ? void 0 : (u.removeClass("in"), n.support.transition && this.$tip.hasClass("fade") ? u.one("bsTransitionEnd", f).emulateTransitionEnd(t.TRANSITION_DURATION) : f(), this.hoverState = null, this)
    };
    t.prototype.fixTitle = function () {
        var n = this.$element;
        (n.attr("title") || "string" != typeof n.attr("data-original-title")) && n.attr("data-original-title", n.attr("title") || "").attr("title", "")
    };
    t.prototype.hasContent = function () {
        return this.getTitle()
    };
    t.prototype.getPosition = function (t) {
        t = t || this.$element;
        var u = t[0], r = "BODY" == u.tagName, i = u.getBoundingClientRect();
        null == i.width && (i = n.extend({}, i, { width: i.right - i.left, height: i.bottom - i.top }));
        var f = r ? { top: 0, left: 0 } : t.offset(),
            e = { scroll: r ? document.documentElement.scrollTop || document.body.scrollTop : t.scrollTop() },
            o = r ? { width: n(window).width(), height: n(window).height() } : null;
        return n.extend({}, i, e, o, f)
    };
    t.prototype.getCalculatedOffset = function (n, t, i, r) {
        return "bottom" == n ? {
            top: t.top + t.height,
            left: t.left + t.width / 2 - i / 2
        } : "top" == n ? {
            top: t.top - r,
            left: t.left + t.width / 2 - i / 2
        } : "left" == n ? { top: t.top + t.height / 2 - r / 2, left: t.left - i } : {
            top: t.top + t.height / 2 - r / 2,
            left: t.left + t.width
        }
    };
    t.prototype.getViewportAdjustedDelta = function (n, t, i, r) {
        var f = { top: 0, left: 0 }, e, u, o, s, h, c;
        return this.$viewport ? (e = this.options.viewport && this.options.viewport.padding || 0, u = this.getPosition(this.$viewport), /right|left/.test(n) ? (o = t.top - e - u.scroll, s = t.top + e - u.scroll + r, o < u.top ? f.top = u.top - o : s > u.top + u.height && (f.top = u.top + u.height - s)) : (h = t.left - e, c = t.left + e + i, h < u.left ? f.left = u.left - h : c > u.width && (f.left = u.left + u.width - c)), f) : f
    };
    t.prototype.getTitle = function () {
        var t = this.$element, n = this.options;
        return t.attr("data-original-title") || ("function" == typeof n.title ? n.title.call(t[0]) : n.title)
    };
    t.prototype.getUID = function (n) {
        do n += ~~(1e6 * Math.random()); while (document.getElementById(n));
        return n
    };
    t.prototype.tip = function () {
        return this.$tip = this.$tip || n(this.options.template)
    };
    t.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
    };
    t.prototype.enable = function () {
        this.enabled = !0
    };
    t.prototype.disable = function () {
        this.enabled = !1
    };
    t.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    };
    t.prototype.toggle = function (t) {
        var i = this;
        t && (i = n(t.currentTarget).data("bs." + this.type), i || (i = new this.constructor(t.currentTarget, this.getDelegateOptions()), n(t.currentTarget).data("bs." + this.type, i)));
        i.tip().hasClass("in") ? i.leave(i) : i.enter(i)
    };
    t.prototype.destroy = function () {
        var n = this;
        clearTimeout(this.timeout);
        this.hide(function () {
            n.$element.off("." + n.type).removeData("bs." + n.type)
        })
    };
    i = n.fn.tooltip;
    n.fn.tooltip = r;
    n.fn.tooltip.Constructor = t;
    n.fn.tooltip.noConflict = function () {
        return n.fn.tooltip = i, this
    }
}(jQuery);
+function (n) {
    "use strict";

    function r(i) {
        return this.each(function () {
            var f = n(this), r = f.data("bs.popover"), u = "object" == typeof i && i, e = u && u.selector;
            (r || "destroy" != i) && (e ? (r || f.data("bs.popover", r = {}), r[e] || (r[e] = new t(this, u))) : r || f.data("bs.popover", r = new t(this, u)), "string" == typeof i && r[i]())
        })
    }

    var t = function (n, t) {
        this.init("popover", n, t)
    }, i;
    if (!n.fn.tooltip) throw new Error("Popover requires tooltip.js");
    t.VERSION = "3.3.1";
    t.DEFAULTS = n.extend({}, n.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"><\/div><h3 class="popover-title"><\/h3><div class="popover-content"><\/div><\/div>'
    });
    t.prototype = n.extend({}, n.fn.tooltip.Constructor.prototype);
    t.prototype.constructor = t;
    t.prototype.getDefaults = function () {
        return t.DEFAULTS
    };
    t.prototype.setContent = function () {
        var n = this.tip(), i = this.getTitle(), t = this.getContent();
        n.find(".popover-title")[this.options.html ? "html" : "text"](i);
        n.find(".popover-content").children().detach().end()[this.options.html ? "string" == typeof t ? "html" : "append" : "text"](t);
        n.removeClass("fade top bottom left right in");
        n.find(".popover-title").html() || n.find(".popover-title").hide()
    };
    t.prototype.hasContent = function () {
        return this.getTitle() || this.getContent()
    };
    t.prototype.getContent = function () {
        var t = this.$element, n = this.options;
        return t.attr("data-content") || ("function" == typeof n.content ? n.content.call(t[0]) : n.content)
    };
    t.prototype.arrow = function () {
        return this.$arrow = this.$arrow || this.tip().find(".arrow")
    };
    t.prototype.tip = function () {
        return this.$tip || (this.$tip = n(this.options.template)), this.$tip
    };
    i = n.fn.popover;
    n.fn.popover = r;
    n.fn.popover.Constructor = t;
    n.fn.popover.noConflict = function () {
        return n.fn.popover = i, this
    }
}(jQuery);
+function (n) {
    "use strict";

    function t(i, r) {
        var u = n.proxy(this.process, this);
        this.$body = n("body");
        this.$scrollElement = n(n(i).is("body") ? window : i);
        this.options = n.extend({}, t.DEFAULTS, r);
        this.selector = (this.options.target || "") + " .nav li > a";
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on("scroll.bs.scrollspy", u);
        this.refresh();
        this.process()
    }

    function i(i) {
        return this.each(function () {
            var u = n(this), r = u.data("bs.scrollspy"), f = "object" == typeof i && i;
            r || u.data("bs.scrollspy", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    }

    t.VERSION = "3.3.1";
    t.DEFAULTS = { offset: 10 };
    t.prototype.getScrollHeight = function () {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    };
    t.prototype.refresh = function () {
        var i = "offset", r = 0, t;
        n.isWindow(this.$scrollElement[0]) || (i = "position", r = this.$scrollElement.scrollTop());
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        t = this;
        this.$body.find(this.selector).map(function () {
            var f = n(this), u = f.data("target") || f.attr("href"), t = /^#./.test(u) && n(u);
            return t && t.length && t.is(":visible") && [[t[i]().top + r, u]] || null
        }).sort(function (n, t) {
            return n[0] - t[0]
        }).each(function () {
            t.offsets.push(this[0]);
            t.targets.push(this[1])
        })
    };
    t.prototype.process = function () {
        var n, i = this.$scrollElement.scrollTop() + this.options.offset, f = this.getScrollHeight(),
            e = this.options.offset + f - this.$scrollElement.height(), t = this.offsets, r = this.targets,
            u = this.activeTarget;
        if (this.scrollHeight != f && this.refresh(), i >= e) return u != (n = r[r.length - 1]) && this.activate(n);
        if (u && i < t[0]) return this.activeTarget = null, this.clear();
        for (n = t.length; n--;) u != r[n] && i >= t[n] && (!t[n + 1] || i <= t[n + 1]) && this.activate(r[n])
    };
    t.prototype.activate = function (t) {
        this.activeTarget = t;
        this.clear();
        var r = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
            i = n(r).parents("li").addClass("active");
        i.parent(".dropdown-menu").length && (i = i.closest("li.dropdown").addClass("active"));
        i.trigger("activate.bs.scrollspy")
    };
    t.prototype.clear = function () {
        n(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var r = n.fn.scrollspy;
    n.fn.scrollspy = i;
    n.fn.scrollspy.Constructor = t;
    n.fn.scrollspy.noConflict = function () {
        return n.fn.scrollspy = r, this
    };
    n(window).on("load.bs.scrollspy.data-api", function () {
        n('[data-spy="scroll"]').each(function () {
            var t = n(this);
            i.call(t, t.data())
        })
    })
}(jQuery);
+function (n) {
    "use strict";

    function r(i) {
        return this.each(function () {
            var u = n(this), r = u.data("bs.tab");
            r || u.data("bs.tab", r = new t(this));
            "string" == typeof i && r[i]()
        })
    }

    var t = function (t) {
        this.element = n(t)
    }, u, i;
    t.VERSION = "3.3.1";
    t.TRANSITION_DURATION = 150;
    t.prototype.show = function () {
        var t = this.element, f = t.closest("ul:not(.dropdown-menu)"), i = t.data("target"), u;
        if (i || (i = t.attr("href"), i = i && i.replace(/.*(?=#[^\s]*$)/, "")), !t.parent("li").hasClass("active")) {
            var r = f.find(".active:last a"), e = n.Event("hide.bs.tab", { relatedTarget: t[0] }),
                o = n.Event("show.bs.tab", { relatedTarget: r[0] });
            (r.trigger(e), t.trigger(o), o.isDefaultPrevented() || e.isDefaultPrevented()) || (u = n(i), this.activate(t.closest("li"), f), this.activate(u, u.parent(), function () {
                r.trigger({ type: "hidden.bs.tab", relatedTarget: t[0] });
                t.trigger({ type: "shown.bs.tab", relatedTarget: r[0] })
            }))
        }
    };
    t.prototype.activate = function (i, r, u) {
        function e() {
            f.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !1);
            i.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded", !0);
            o ? (i[0].offsetWidth, i.addClass("in")) : i.removeClass("fade");
            i.parent(".dropdown-menu") && i.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded", !0);
            u && u()
        }

        var f = r.find("> .active"),
            o = u && n.support.transition && (f.length && f.hasClass("fade") || !!r.find("> .fade").length);
        f.length && o ? f.one("bsTransitionEnd", e).emulateTransitionEnd(t.TRANSITION_DURATION) : e();
        f.removeClass("in")
    };
    u = n.fn.tab;
    n.fn.tab = r;
    n.fn.tab.Constructor = t;
    n.fn.tab.noConflict = function () {
        return n.fn.tab = u, this
    };
    i = function (t) {
        t.preventDefault();
        r.call(n(this), "show")
    };
    n(document).on("click.bs.tab.data-api", '[data-toggle="tab"]', i).on("click.bs.tab.data-api", '[data-toggle="pill"]', i)
}(jQuery);
+function (n) {
    "use strict";

    function i(i) {
        return this.each(function () {
            var u = n(this), r = u.data("bs.affix"), f = "object" == typeof i && i;
            r || u.data("bs.affix", r = new t(this, f));
            "string" == typeof i && r[i]()
        })
    }

    var t = function (i, r) {
        this.options = n.extend({}, t.DEFAULTS, r);
        this.$target = n(this.options.target).on("scroll.bs.affix.data-api", n.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", n.proxy(this.checkPositionWithEventLoop, this));
        this.$element = n(i);
        this.affixed = this.unpin = this.pinnedOffset = null;
        this.checkPosition()
    }, r;
    t.VERSION = "3.3.1";
    t.RESET = "affix affix-top affix-bottom";
    t.DEFAULTS = { offset: 0, target: window };
    t.prototype.getState = function (n, t, i, r) {
        var u = this.$target.scrollTop(), f = this.$element.offset(), e = this.$target.height();
        if (null != i && "top" == this.affixed) return i > u ? "top" : !1;
        if ("bottom" == this.affixed) return null != i ? u + this.unpin <= f.top ? !1 : "bottom" : n - r >= u + e ? !1 : "bottom";
        var o = null == this.affixed, s = o ? u : f.top, h = o ? e : t;
        return null != i && i >= s ? "top" : null != r && s + h >= n - r ? "bottom" : !1
    };
    t.prototype.getPinnedOffset = function () {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(t.RESET).addClass("affix");
        var n = this.$target.scrollTop(), i = this.$element.offset();
        return this.pinnedOffset = i.top - n
    };
    t.prototype.checkPositionWithEventLoop = function () {
        setTimeout(n.proxy(this.checkPosition, this), 1)
    };
    t.prototype.checkPosition = function () {
        var i, e, o;
        if (this.$element.is(":visible")) {
            var s = this.$element.height(), r = this.options.offset, f = r.top, u = r.bottom, h = n("body").height();
            if ("object" != typeof r && (u = f = r), "function" == typeof f && (f = r.top(this.$element)), "function" == typeof u && (u = r.bottom(this.$element)), i = this.getState(h, s, f, u), this.affixed != i) {
                if (null != this.unpin && this.$element.css("top", ""), e = "affix" + (i ? "-" + i : ""), o = n.Event(e + ".bs.affix"), this.$element.trigger(o), o.isDefaultPrevented()) return;
                this.affixed = i;
                this.unpin = "bottom" == i ? this.getPinnedOffset() : null;
                this.$element.removeClass(t.RESET).addClass(e).trigger(e.replace("affix", "affixed") + ".bs.affix")
            }
            "bottom" == i && this.$element.offset({ top: h - s - u })
        }
    };
    r = n.fn.affix;
    n.fn.affix = i;
    n.fn.affix.Constructor = t;
    n.fn.affix.noConflict = function () {
        return n.fn.affix = r, this
    };
    n(window).on("load", function () {
        n('[data-spy="affix"]').each(function () {
            var r = n(this), t = r.data();
            t.offset = t.offset || {};
            null != t.offsetBottom && (t.offset.bottom = t.offsetBottom);
            null != t.offsetTop && (t.offset.top = t.offsetTop);
            i.call(r, t)
        })
    })
}(jQuery);
$(document).ready(function () {
    function n() {
        var u = $(".credit-score-buttons").data("selectedapr"), n = parseInt($(".loan-term").html()),
            t = parseInt($(".loan-amount").html()), i = 48, r = 7500,
            f = parseFloat(((t * u * (n / 12) + t) / n).toFixed(2)),
            e = parseFloat(((r * u * (i / 12) + r) / i).toFixed(2)), o = f * n, s = e * i, h = o - t, c = s - r;
        $(".total-repayment-amount").html(o.toFixed(2));
        $(".total-cost").html(h.toFixed(2));
        $(".monthly-repayment-amount").html(f.toFixed(2));
        $(".rep-total-repayment-amount").html(s.toFixed(2));
        $(".rep-total-cost").html(c.toFixed(2));
        $(".rep-monthly-repayment-amount").html(e.toFixed(2))
    }

    $(".loan-amount-slider").slider({
        value: 5e3, min: 3e3, max: 5e4, step: 500, slide: function (t, i) {
            $(".loan-amount").html(i.value);
            n();
            $(".apply-now-button").attr("href", "/apply-today/?LoanAmount=" + i.value)
        }
    });
    $(".loan-term-slider").slider({
        value: 24, min: 12, max: 60, step: 1, slide: function (t, i) {
            $(".loan-term").html(i.value);
            n();
            $(".monthly-repayments").html(i.value)
        }
    });
    $(".credit-score-buttons a").on("click", function () {
        var t = $(this).data("apr"), i = $(this).data("percent");
        $(".credit-score-percent").html(i);
        $(".credit-score-buttons").data("selectedapr", t);
        $(".credit-score-rating").html($(this).html());
        n()
    });
    $(window).width() >= 768 && $(".car-finance-calculator a").tooltip()
});
/*!
 * Validator v0.6.0 for Bootstrap 3, by @1000hz
 * Copyright 2014 Spiceworks, Inc.
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/1000hz/bootstrap-validator
 */
+function (n) {
    "use strict";

    function i(i) {
        return this.each(function () {
            var u = n(this), f = n.extend({}, t.DEFAULTS, u.data(), "object" == typeof i && i),
                r = u.data("bs.validator");
            (r || "destroy" != i) && (r || u.data("bs.validator", r = new t(this, f)), "string" == typeof i && r[i]())
        })
    }

    var t = function (t, i) {
        this.$element = n(t);
        this.options = i;
        this.$element.attr("novalidate", !0);
        this.toggleSubmit();
        this.$element.on("input.bs.validator change.bs.validator focusout.bs.validator", n.proxy(this.validateInput, this));
        this.$element.on("submit.bs.validator", n.proxy(this.onSubmit, this));
        this.$element.find("[data-match]").each(function () {
            var t = n(this), i = t.data("match");
            n(i).on("input.bs.validator", function () {
                t.val() && t.trigger("input")
            })
        })
    }, r;
    t.DEFAULTS = { delay: 500, html: !1, disable: !0, errors: { match: "Does not match", minlength: "Not long enough" } };
    t.VALIDATORS = {
        "native": function (n) {
            var t = n[0];
            return t.checkValidity ? t.checkValidity() : !0
        }, match: function (t) {
            var i = t.data("match");
            return !t.val() || t.val() === n(i).val()
        }, minlength: function (n) {
            var t = n.data("minlength");
            return !n.val() || n.val().length >= t
        }
    };
    t.prototype.validateInput = function (t) {
        var i = n(t.target), u = i.data("bs.validator.errors"), r;
        (i.is('[type="radio"]') && (i = this.$element.find('input[name="' + i.attr("name") + '"]')), this.$element.trigger(t = n.Event("validate.bs.validator", { relatedTarget: i[0] })), t.isDefaultPrevented()) || (r = this, this.runValidators(i).done(function (f) {
            i.data("bs.validator.errors", f);
            f.length ? r.showErrors(i) : r.clearErrors(i);
            u && f.toString() === u.toString() || (t = f.length ? n.Event("invalid.bs.validator", {
                relatedTarget: i[0],
                detail: f
            }) : n.Event("valid.bs.validator", { relatedTarget: i[0], detail: u }), r.$element.trigger(t));
            r.toggleSubmit();
            r.$element.trigger(n.Event("validated.bs.validator", { relatedTarget: i[0] }))
        }))
    };
    t.prototype.runValidators = function (i) {
        function f(n) {
            return i.data(n + "-error") || i.data("error") || "native" == n && i[0].validationMessage || e.errors[n]
        }

        var r = [], u = ([t.VALIDATORS["native"]], n.Deferred()), e = this.options;
        return i.data("bs.validator.deferred") && i.data("bs.validator.deferred").reject(), i.data("bs.validator.deferred", u), n.each(t.VALIDATORS, n.proxy(function (n, t) {
            if ((i.data(n) || "native" == n) && !t.call(this, i)) {
                var u = f(n);
                ~r.indexOf(u) || r.push(u)
            }
        }, this)), !r.length && i.val() && i.data("remote") ? this.defer(i, function () {
            n.get(i.data("remote"), [i.attr("name"), i.val()].join("=")).fail(function (n, t, i) {
                r.push(f("remote") || i)
            }).always(function () {
                u.resolve(r)
            })
        }) : u.resolve(r), u.promise()
    };
    t.prototype.validate = function () {
        var n = this.options.delay;
        return this.options.delay = 0, this.$element.find(":input").trigger("input"), this.options.delay = n, this
    };
    t.prototype.showErrors = function (t) {
        var i = this.options.html ? "html" : "text";
        this.defer(t, function () {
            var f = t.closest(".form-group"), r = f.find(".help-block.with-errors"), u = t.data("bs.validator.errors");
            u.length && (u = n("<ul/>").addClass("list-unstyled").append(n.map(u, function (t) {
                return n("<li/>")[i](t)
            })), void 0 === r.data("bs.validator.originalContent") && r.data("bs.validator.originalContent", r.html()), r.empty().append(u), f.addClass("has-error"))
        })
    };
    t.prototype.clearErrors = function (n) {
        var t = n.closest(".form-group"), i = t.find(".help-block.with-errors");
        i.html(i.data("bs.validator.originalContent"));
        t.removeClass("has-error")
    };
    t.prototype.hasErrors = function () {
        function t() {
            return !!(n(this).data("bs.validator.errors") || []).length
        }

        return !!this.$element.find(":input:enabled").filter(t).length
    };
    t.prototype.isIncomplete = function () {
        function t() {
            return "checkbox" === this.type ? !this.checked : "radio" === this.type ? !n('[name="' + this.name + '"]:checked').length : "" === n.trim(this.value)
        }

        return !!this.$element.find(":input[required]:enabled").filter(t).length
    };
    t.prototype.onSubmit = function (n) {
        this.validate();
        (this.isIncomplete() || this.hasErrors()) && n.preventDefault()
    };
    t.prototype.toggleSubmit = function () {
        if (this.options.disable) {
            var n = this.$element.find('input[type="submit"], button[type="submit"]');
            n.toggleClass("disabled", this.isIncomplete() || this.hasErrors()).css({
                "pointer-events": "all",
                cursor: "pointer"
            })
        }
    };
    t.prototype.defer = function (n, t) {
        return this.options.delay ? (window.clearTimeout(n.data("bs.validator.timeout")), void n.data("bs.validator.timeout", window.setTimeout(t, this.options.delay))) : t()
    };
    t.prototype.destroy = function () {
        return this.$element.removeAttr("novalidate").removeData("bs.validator").off(".bs.validator"), this.$element.find(":input").removeData(["bs.validator.errors", "bs.validator.deferred", "bs.validator.timeout"]).off(".bs.validator"), this.$element.find(".help-block.with-errors").each(function () {
            var t = n(this), i = t.data("bs.validator.originalContent");
            t.removeData("bs.validator.originalContent").html(i)
        }), this.$element.find('input[type="submit"], button[type="submit"]').removeClass("disabled"), this.$element.find(".has-error").removeClass("has-error"), this
    };
    r = n.fn.validator;
    n.fn.validator = i;
    n.fn.validator.Constructor = t;
    n.fn.validator.noConflict = function () {
        return n.fn.validator = r, this
    };
    n(window).on("load", function () {
        n('form[data-toggle="validator"]').each(function () {
            var t = n(this);
            i.call(t, t.data())
        })
    })
}(jQuery);
/*!
 handlebars v2.0.0
Copyright (C) 2011-2014 by Yehuda Katz
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
@license
*/
(function (n, t) {
    typeof define == "function" && define.amd ? define([], t) : typeof exports == "object" ? module.exports = t() : n.Handlebars = n.Handlebars || t()
})(this, function () {
    var r = function () {
        "use strict";

        function n(n) {
            this.string = n
        }

        return n.prototype.toString = function () {
            return "" + this.string
        }, n
    }(), t = function (n) {
        "use strict";

        function h(n) {
            return e[n]
        }

        function c(n) {
            for (var i, t = 1; t < arguments.length; t++) for (i in arguments[t]) Object.prototype.hasOwnProperty.call(arguments[t], i) && (n[i] = arguments[t][i]);
            return n
        }

        function l(n) {
            return n instanceof f ? n.toString() : n == null ? "" : n ? (n = "" + n, !s.test(n)) ? n : n.replace(o, h) : n + ""
        }

        function a(n) {
            return n || n === 0 ? u(n) && n.length === 0 ? !0 : !1 : !0
        }

        function v(n, t) {
            return (n ? n + "." : "") + t
        }

        var t = {}, f = n, e = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" },
            o = /[&<>"'`]/g, s = /[&<>"'`]/, i, r, u;
        return t.extend = c, i = Object.prototype.toString, t.toString = i, r = function (n) {
            return typeof n == "function"
        }, r(/x/) && (r = function (n) {
            return typeof n == "function" && i.call(n) === "[object Function]"
        }), t.isFunction = r, u = Array.isArray || function (n) {
            return n && typeof n == "object" ? i.call(n) === "[object Array]" : !1
        }, t.isArray = u, t.escapeExpression = l, t.isEmpty = a, t.appendContextPath = v, t
    }(r), n = function () {
        "use strict";

        function t(t, i) {
            var u, f, r;
            for (i && i.firstLine && (u = i.firstLine, t += " - " + u + ":" + i.firstColumn), f = Error.prototype.constructor.call(this, t), r = 0; r < n.length; r++) this[n[r]] = f[n[r]];
            u && (this.lineNumber = u, this.column = i.firstColumn)
        }

        var n = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
        return t.prototype = new Error, t
    }(), i = function (n, t) {
        "use strict";

        function s(n, t) {
            this.helpers = n || {};
            this.partials = t || {};
            p(this)
        }

        function p(n) {
            n.registerHelper("helperMissing", function () {
                if (arguments.length === 1) return undefined;
                throw new e("Missing helper: '" + arguments[arguments.length - 1].name + "'");
            });
            n.registerHelper("blockHelperMissing", function (t, r) {
                var e = r.inverse, o = r.fn, u;
                return t === !0 ? o(this) : t === !1 || t == null ? e(this) : a(t) ? t.length > 0 ? (r.ids && (r.ids = [r.name]), n.helpers.each(t, r)) : e(this) : (r.data && r.ids && (u = f(r.data), u.contextPath = i.appendContextPath(r.data.contextPath, r.name), r = { data: u }), o(t, r))
            });
            n.registerHelper("each", function (n, t) {
                var v, c;
                if (!t) throw new e("Must pass iterator to #each");
                var l = t.fn, y = t.inverse, u = 0, s = "", r, h;
                if (t.data && t.ids && (h = i.appendContextPath(t.data.contextPath, t.ids[0]) + "."), o(n) && (n = n.call(this)), t.data && (r = f(t.data)), n && typeof n == "object") if (a(n)) for (v = n.length; u < v; u++) r && (r.index = u, r.first = u === 0, r.last = u === n.length - 1, h && (r.contextPath = h + u)), s = s + l(n[u], { data: r }); else for (c in n) n.hasOwnProperty(c) && (r && (r.key = c, r.index = u, r.first = u === 0, h && (r.contextPath = h + c)), s = s + l(n[c], { data: r }), u++);
                return u === 0 && (s = y(this)), s
            });
            n.registerHelper("if", function (n, t) {
                return o(n) && (n = n.call(this)), (t.hash.includeZero || n) && !i.isEmpty(n) ? t.fn(this) : t.inverse(this)
            });
            n.registerHelper("unless", function (t, i) {
                return n.helpers["if"].call(this, t, { fn: i.inverse, inverse: i.fn, hash: i.hash })
            });
            n.registerHelper("with", function (n, t) {
                var u, r;
                return o(n) && (n = n.call(this)), u = t.fn, i.isEmpty(n) ? t.inverse(this) : (t.data && t.ids && (r = f(t.data), r.contextPath = i.appendContextPath(t.data.contextPath, t.ids[0]), t = { data: r }), u(n, t))
            });
            n.registerHelper("log", function (t, i) {
                var r = i.data && i.data.level != null ? parseInt(i.data.level, 10) : 1;
                n.log(r, t)
            });
            n.registerHelper("lookup", function (n, t) {
                return n && n[t]
            })
        }

        var r = {}, i = n, e = t, c, l, u, h, f;
        r.VERSION = "2.0.0";
        c = 6;
        r.COMPILER_REVISION = c;
        l = {
            1: "<= 1.0.rc.2",
            2: "== 1.0.0-rc.3",
            3: "== 1.0.0-rc.4",
            4: "== 1.x.x",
            5: "== 2.0.0-alpha.x",
            6: ">= 2.0.0-beta.1"
        };
        r.REVISION_CHANGES = l;
        var a = i.isArray, o = i.isFunction, v = i.toString, y = "[object Object]";
        return r.HandlebarsEnvironment = s, s.prototype = {
            constructor: s,
            logger: u,
            log: h,
            registerHelper: function (n, t) {
                if (v.call(n) === y) {
                    if (t) throw new e("Arg not supported with multiple helpers");
                    i.extend(this.helpers, n)
                } else this.helpers[n] = t
            },
            unregisterHelper: function (n) {
                delete this.helpers[n]
            },
            registerPartial: function (n, t) {
                v.call(n) === y ? i.extend(this.partials, n) : this.partials[n] = t
            },
            unregisterPartial: function (n) {
                delete this.partials[n]
            }
        }, u = {
            methodMap: { 0: "debug", 1: "info", 2: "warn", 3: "error" },
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,
            log: function (n, t) {
                if (u.level <= n) {
                    var i = u.methodMap[n];
                    typeof console != "undefined" && console[i] && console[i].call(console, t)
                }
            }
        }, r.logger = u, h = u.log, r.log = h, f = function (n) {
            var t = i.extend({}, n);
            return t._parent = n, t
        }, r.createFrame = f, r
    }(t, n), f = function (n, t, i) {
        "use strict";

        function c(n) {
            var t = n && n[0] || 1, i = s, u, f;
            if (t !== i) if (t < i) {
                u = o[i];
                f = o[t];
                throw new r("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + u + ") or downgrade your runtime to an older version (" + f + ").");
            } else throw new r("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + n[1] + ").");
        }

        function l(n, t) {
            if (!t) throw new r("No environment passed to template");
            if (!n || !n.main) throw new r("Unknown template object: " + typeof n);
            t.VM.checkRevision(n.compiler);
            var o = function (i, u, f, o, s, h, c, l, a) {
                var v, b, p, y, w;
                if (s && (o = e.extend({}, o, s)), v = t.VM.invokePartial.call(this, i, f, o, h, c, l, a), v == null && t.compile && (b = {
                    helpers: h,
                    partials: c,
                    data: l,
                    depths: a
                }, c[f] = t.compile(i, { data: l !== undefined, compat: n.compat }, t), v = c[f](o, b)), v != null) {
                    if (u) {
                        for (p = v.split("\n"), y = 0, w = p.length; y < w; y++) {
                            if (!p[y] && y + 1 === w) break;
                            p[y] = u + p[y]
                        }
                        v = p.join("\n")
                    }
                    return v
                }
                throw new r("The partial " + f + " could not be compiled when running in runtime-only mode");
            }, i = {
                lookup: function (n, t) {
                    for (var r = n.length, i = 0; i < r; i++) if (n[i] && n[i][t] != null) return n[i][t]
                }, lambda: function (n, t) {
                    return typeof n == "function" ? n.call(t) : n
                }, escapeExpression: e.escapeExpression, invokePartial: o, fn: function (t) {
                    return n[t]
                }, programs: [], program: function (n, t, i) {
                    var r = this.programs[n], u = this.fn(n);
                    return t || i ? r = f(this, n, u, t, i) : r || (r = this.programs[n] = f(this, n, u)), r
                }, data: function (n, t) {
                    while (n && t--) n = n._parent;
                    return n
                }, merge: function (n, t) {
                    var i = n || t;
                    return n && t && n !== t && (i = e.extend({}, t, n)), i
                }, noop: t.VM.noop, compilerInfo: n.compiler
            }, u = function (t, r) {
                var f, e;
                return r = r || {}, f = r.data, u._setup(r), !r.partial && n.useData && (f = y(t, f)), n.useDepths && (e = r.depths ? [t].concat(r.depths) : [t]), n.main.call(i, t, i.helpers, i.partials, f, e)
            };
            return u.isTop = !0, u._setup = function (r) {
                r.partial ? (i.helpers = r.helpers, i.partials = r.partials) : (i.helpers = i.merge(r.helpers, t.helpers), n.usePartial && (i.partials = i.merge(r.partials, t.partials)))
            }, u._child = function (t, u, e) {
                if (n.useDepths && !e) throw new r("must pass parent depths");
                return f(i, t, n[t], u, e)
            }, u
        }

        function f(n, t, i, r, u) {
            var f = function (t, f) {
                return f = f || {}, i.call(n, t, n.helpers, n.partials, f.data || r, u && [t].concat(u))
            };
            return f.program = t, f.depth = u ? u.length : 0, f
        }

        function a(n, t, i, u, f, e, o) {
            var s = { partial: !0, helpers: u, partials: f, data: e, depths: o };
            if (n === undefined) throw new r("The partial " + t + " could not be found"); else if (n instanceof Function) return n(i, s)
        }

        function v() {
            return ""
        }

        function y(n, t) {
            return t && "root" in t || (t = t ? h(t) : {}, t.root = n), t
        }

        var u = {}, e = n, r = t, s = i.COMPILER_REVISION, o = i.REVISION_CHANGES, h = i.createFrame;
        return u.checkRevision = c, u.template = l, u.program = f, u.invokePartial = a, u.noop = v, u
    }(t, n, i), e = function (n, t, i, r, u) {
        "use strict";
        var o = n, c = t, l = i, e = r, s = u, h = function () {
            var n = new o.HandlebarsEnvironment;
            return e.extend(n, o), n.SafeString = c, n.Exception = l, n.Utils = e, n.escapeExpression = e.escapeExpression, n.VM = s, n.template = function (t) {
                return s.template(t, n)
            }, n
        }, f = h();
        return f.create = h, f["default"] = f, f
    }(i, r, n, t, f), u = function (n) {
        "use strict";

        function t(n) {
            n = n || {};
            this.firstLine = n.first_line;
            this.firstColumn = n.first_column;
            this.lastColumn = n.last_column;
            this.lastLine = n.last_line
        }

        var r = n, i = {
            ProgramNode: function (n, i, r) {
                t.call(this, r);
                this.type = "program";
                this.statements = n;
                this.strip = i
            }, MustacheNode: function (n, r, u, f, e) {
                if (t.call(this, e), this.type = "mustache", this.strip = f, u != null && u.charAt) {
                    var o = u.charAt(3) || u.charAt(2);
                    this.escaped = o !== "{" && o !== "&"
                } else this.escaped = !!u;
                this.sexpr = n instanceof i.SexprNode ? n : new i.SexprNode(n, r);
                this.id = this.sexpr.id;
                this.params = this.sexpr.params;
                this.hash = this.sexpr.hash;
                this.eligibleHelper = this.sexpr.eligibleHelper;
                this.isHelper = this.sexpr.isHelper
            }, SexprNode: function (n, i, r) {
                t.call(this, r);
                this.type = "sexpr";
                this.hash = i;
                var u = this.id = n[0], f = this.params = n.slice(1);
                this.isHelper = !!(f.length || i);
                this.eligibleHelper = this.isHelper || u.isSimple
            }, PartialNode: function (n, i, r, u, f) {
                t.call(this, f);
                this.type = "partial";
                this.partialName = n;
                this.context = i;
                this.hash = r;
                this.strip = u;
                this.strip.inlineStandalone = !0
            }, BlockNode: function (n, i, r, u, f) {
                t.call(this, f);
                this.type = "block";
                this.mustache = n;
                this.program = i;
                this.inverse = r;
                this.strip = u;
                r && !i && (this.isInverse = !0)
            }, RawBlockNode: function (n, u, f, e) {
                if (t.call(this, e), n.sexpr.id.original !== f) throw new r(n.sexpr.id.original + " doesn't match " + f, this);
                u = new i.ContentNode(u, e);
                this.type = "block";
                this.mustache = n;
                this.program = new i.ProgramNode([u], {}, e)
            }, ContentNode: function (n, i) {
                t.call(this, i);
                this.type = "content";
                this.original = this.string = n
            }, HashNode: function (n, i) {
                t.call(this, i);
                this.type = "hash";
                this.pairs = n
            }, IdNode: function (n, i) {
                var f, c, u;
                t.call(this, i);
                this.type = "ID";
                var o = "", e = [], s = 0, h = "";
                for (f = 0, c = n.length; f < c; f++) if (u = n[f].part, o += (n[f].separator || "") + u, u === ".." || u === "." || u === "this") if (e.length > 0) throw new r("Invalid path: " + o, this); else u === ".." ? (s++ , h += "../") : this.isScoped = !0; else e.push(u);
                this.original = o;
                this.parts = e;
                this.string = e.join(".");
                this.depth = s;
                this.idName = h + this.string;
                this.isSimple = n.length === 1 && !this.isScoped && s === 0;
                this.stringModeValue = this.string
            }, PartialNameNode: function (n, i) {
                t.call(this, i);
                this.type = "PARTIAL_NAME";
                this.name = n.original
            }, DataNode: function (n, i) {
                t.call(this, i);
                this.type = "DATA";
                this.id = n;
                this.stringModeValue = n.stringModeValue;
                this.idName = "@" + n.stringModeValue
            }, StringNode: function (n, i) {
                t.call(this, i);
                this.type = "STRING";
                this.original = this.string = this.stringModeValue = n
            }, NumberNode: function (n, i) {
                t.call(this, i);
                this.type = "NUMBER";
                this.original = this.number = n;
                this.stringModeValue = Number(n)
            }, BooleanNode: function (n, i) {
                t.call(this, i);
                this.type = "BOOLEAN";
                this.bool = n;
                this.stringModeValue = n === "true"
            }, CommentNode: function (n, i) {
                t.call(this, i);
                this.type = "comment";
                this.comment = n;
                this.strip = { inlineStandalone: !0 }
            }
        };
        return i
    }(n), o = function () {
        "use strict";
        return function () {
            function t() {
                this.yy = {}
            }

            var n = {
                trace: function () {
                },
                yy: {},
                symbols_: {
                    error: 2,
                    root: 3,
                    program: 4,
                    EOF: 5,
                    program_repetition0: 6,
                    statement: 7,
                    mustache: 8,
                    block: 9,
                    rawBlock: 10,
                    partial: 11,
                    CONTENT: 12,
                    COMMENT: 13,
                    openRawBlock: 14,
                    END_RAW_BLOCK: 15,
                    OPEN_RAW_BLOCK: 16,
                    sexpr: 17,
                    CLOSE_RAW_BLOCK: 18,
                    openBlock: 19,
                    block_option0: 20,
                    closeBlock: 21,
                    openInverse: 22,
                    block_option1: 23,
                    OPEN_BLOCK: 24,
                    CLOSE: 25,
                    OPEN_INVERSE: 26,
                    inverseAndProgram: 27,
                    INVERSE: 28,
                    OPEN_ENDBLOCK: 29,
                    path: 30,
                    OPEN: 31,
                    OPEN_UNESCAPED: 32,
                    CLOSE_UNESCAPED: 33,
                    OPEN_PARTIAL: 34,
                    partialName: 35,
                    param: 36,
                    partial_option0: 37,
                    partial_option1: 38,
                    sexpr_repetition0: 39,
                    sexpr_option0: 40,
                    dataName: 41,
                    STRING: 42,
                    NUMBER: 43,
                    BOOLEAN: 44,
                    OPEN_SEXPR: 45,
                    CLOSE_SEXPR: 46,
                    hash: 47,
                    hash_repetition_plus0: 48,
                    hashSegment: 49,
                    ID: 50,
                    EQUALS: 51,
                    DATA: 52,
                    pathSegments: 53,
                    SEP: 54,
                    $accept: 0,
                    $end: 1
                },
                terminals_: {
                    2: "error",
                    5: "EOF",
                    12: "CONTENT",
                    13: "COMMENT",
                    15: "END_RAW_BLOCK",
                    16: "OPEN_RAW_BLOCK",
                    18: "CLOSE_RAW_BLOCK",
                    24: "OPEN_BLOCK",
                    25: "CLOSE",
                    26: "OPEN_INVERSE",
                    28: "INVERSE",
                    29: "OPEN_ENDBLOCK",
                    31: "OPEN",
                    32: "OPEN_UNESCAPED",
                    33: "CLOSE_UNESCAPED",
                    34: "OPEN_PARTIAL",
                    42: "STRING",
                    43: "NUMBER",
                    44: "BOOLEAN",
                    45: "OPEN_SEXPR",
                    46: "CLOSE_SEXPR",
                    50: "ID",
                    51: "EQUALS",
                    52: "DATA",
                    54: "SEP"
                },
                productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [10, 3], [14, 3], [9, 4], [9, 4], [19, 3], [22, 3], [27, 2], [21, 3], [8, 3], [8, 3], [11, 5], [11, 4], [17, 3], [17, 1], [36, 1], [36, 1], [36, 1], [36, 1], [36, 1], [36, 3], [47, 1], [49, 3], [35, 1], [35, 1], [35, 1], [41, 2], [30, 1], [53, 3], [53, 1], [6, 0], [6, 2], [20, 0], [20, 1], [23, 0], [23, 1], [37, 0], [37, 1], [38, 0], [38, 1], [39, 0], [39, 2], [40, 0], [40, 1], [48, 1], [48, 2]],
                performAction: function (n, t, i, r, u, f) {
                    var e = f.length - 1;
                    switch (u) {
                        case 1:
                            return r.prepareProgram(f[e - 1].statements, !0), f[e - 1];
                        case 2:
                            this.$ = new r.ProgramNode(r.prepareProgram(f[e]), {}, this._$);
                            break;
                        case 3:
                            this.$ = f[e];
                            break;
                        case 4:
                            this.$ = f[e];
                            break;
                        case 5:
                            this.$ = f[e];
                            break;
                        case 6:
                            this.$ = f[e];
                            break;
                        case 7:
                            this.$ = new r.ContentNode(f[e], this._$);
                            break;
                        case 8:
                            this.$ = new r.CommentNode(f[e], this._$);
                            break;
                        case 9:
                            this.$ = new r.RawBlockNode(f[e - 2], f[e - 1], f[e], this._$);
                            break;
                        case 10:
                            this.$ = new r.MustacheNode(f[e - 1], null, "", "", this._$);
                            break;
                        case 11:
                            this.$ = r.prepareBlock(f[e - 3], f[e - 2], f[e - 1], f[e], !1, this._$);
                            break;
                        case 12:
                            this.$ = r.prepareBlock(f[e - 3], f[e - 2], f[e - 1], f[e], !0, this._$);
                            break;
                        case 13:
                            this.$ = new r.MustacheNode(f[e - 1], null, f[e - 2], r.stripFlags(f[e - 2], f[e]), this._$);
                            break;
                        case 14:
                            this.$ = new r.MustacheNode(f[e - 1], null, f[e - 2], r.stripFlags(f[e - 2], f[e]), this._$);
                            break;
                        case 15:
                            this.$ = { strip: r.stripFlags(f[e - 1], f[e - 1]), program: f[e] };
                            break;
                        case 16:
                            this.$ = { path: f[e - 1], strip: r.stripFlags(f[e - 2], f[e]) };
                            break;
                        case 17:
                            this.$ = new r.MustacheNode(f[e - 1], null, f[e - 2], r.stripFlags(f[e - 2], f[e]), this._$);
                            break;
                        case 18:
                            this.$ = new r.MustacheNode(f[e - 1], null, f[e - 2], r.stripFlags(f[e - 2], f[e]), this._$);
                            break;
                        case 19:
                            this.$ = new r.PartialNode(f[e - 3], f[e - 2], f[e - 1], r.stripFlags(f[e - 4], f[e]), this._$);
                            break;
                        case 20:
                            this.$ = new r.PartialNode(f[e - 2], undefined, f[e - 1], r.stripFlags(f[e - 3], f[e]), this._$);
                            break;
                        case 21:
                            this.$ = new r.SexprNode([f[e - 2]].concat(f[e - 1]), f[e], this._$);
                            break;
                        case 22:
                            this.$ = new r.SexprNode([f[e]], null, this._$);
                            break;
                        case 23:
                            this.$ = f[e];
                            break;
                        case 24:
                            this.$ = new r.StringNode(f[e], this._$);
                            break;
                        case 25:
                            this.$ = new r.NumberNode(f[e], this._$);
                            break;
                        case 26:
                            this.$ = new r.BooleanNode(f[e], this._$);
                            break;
                        case 27:
                            this.$ = f[e];
                            break;
                        case 28:
                            f[e - 1].isHelper = !0;
                            this.$ = f[e - 1];
                            break;
                        case 29:
                            this.$ = new r.HashNode(f[e], this._$);
                            break;
                        case 30:
                            this.$ = [f[e - 2], f[e]];
                            break;
                        case 31:
                            this.$ = new r.PartialNameNode(f[e], this._$);
                            break;
                        case 32:
                            this.$ = new r.PartialNameNode(new r.StringNode(f[e], this._$), this._$);
                            break;
                        case 33:
                            this.$ = new r.PartialNameNode(new r.NumberNode(f[e], this._$));
                            break;
                        case 34:
                            this.$ = new r.DataNode(f[e], this._$);
                            break;
                        case 35:
                            this.$ = new r.IdNode(f[e], this._$);
                            break;
                        case 36:
                            f[e - 2].push({ part: f[e], separator: f[e - 1] });
                            this.$ = f[e - 2];
                            break;
                        case 37:
                            this.$ = [{ part: f[e] }];
                            break;
                        case 38:
                            this.$ = [];
                            break;
                        case 39:
                            f[e - 1].push(f[e]);
                            break;
                        case 48:
                            this.$ = [];
                            break;
                        case 49:
                            f[e - 1].push(f[e]);
                            break;
                        case 52:
                            this.$ = [f[e]];
                            break;
                        case 53:
                            f[e - 1].push(f[e])
                    }
                },
                table: [{
                    3: 1,
                    4: 2,
                    5: [2, 38],
                    6: 3,
                    12: [2, 38],
                    13: [2, 38],
                    16: [2, 38],
                    24: [2, 38],
                    26: [2, 38],
                    31: [2, 38],
                    32: [2, 38],
                    34: [2, 38]
                }, { 1: [3] }, { 5: [1, 4] }, {
                    5: [2, 2],
                    7: 5,
                    8: 6,
                    9: 7,
                    10: 8,
                    11: 9,
                    12: [1, 10],
                    13: [1, 11],
                    14: 16,
                    16: [1, 20],
                    19: 14,
                    22: 15,
                    24: [1, 18],
                    26: [1, 19],
                    28: [2, 2],
                    29: [2, 2],
                    31: [1, 12],
                    32: [1, 13],
                    34: [1, 17]
                }, { 1: [2, 1] }, {
                    5: [2, 39],
                    12: [2, 39],
                    13: [2, 39],
                    16: [2, 39],
                    24: [2, 39],
                    26: [2, 39],
                    28: [2, 39],
                    29: [2, 39],
                    31: [2, 39],
                    32: [2, 39],
                    34: [2, 39]
                }, {
                    5: [2, 3],
                    12: [2, 3],
                    13: [2, 3],
                    16: [2, 3],
                    24: [2, 3],
                    26: [2, 3],
                    28: [2, 3],
                    29: [2, 3],
                    31: [2, 3],
                    32: [2, 3],
                    34: [2, 3]
                }, {
                    5: [2, 4],
                    12: [2, 4],
                    13: [2, 4],
                    16: [2, 4],
                    24: [2, 4],
                    26: [2, 4],
                    28: [2, 4],
                    29: [2, 4],
                    31: [2, 4],
                    32: [2, 4],
                    34: [2, 4]
                }, {
                    5: [2, 5],
                    12: [2, 5],
                    13: [2, 5],
                    16: [2, 5],
                    24: [2, 5],
                    26: [2, 5],
                    28: [2, 5],
                    29: [2, 5],
                    31: [2, 5],
                    32: [2, 5],
                    34: [2, 5]
                }, {
                    5: [2, 6],
                    12: [2, 6],
                    13: [2, 6],
                    16: [2, 6],
                    24: [2, 6],
                    26: [2, 6],
                    28: [2, 6],
                    29: [2, 6],
                    31: [2, 6],
                    32: [2, 6],
                    34: [2, 6]
                }, {
                    5: [2, 7],
                    12: [2, 7],
                    13: [2, 7],
                    16: [2, 7],
                    24: [2, 7],
                    26: [2, 7],
                    28: [2, 7],
                    29: [2, 7],
                    31: [2, 7],
                    32: [2, 7],
                    34: [2, 7]
                }, {
                    5: [2, 8],
                    12: [2, 8],
                    13: [2, 8],
                    16: [2, 8],
                    24: [2, 8],
                    26: [2, 8],
                    28: [2, 8],
                    29: [2, 8],
                    31: [2, 8],
                    32: [2, 8],
                    34: [2, 8]
                }, { 17: 21, 30: 22, 41: 23, 50: [1, 26], 52: [1, 25], 53: 24 }, {
                    17: 27,
                    30: 22,
                    41: 23,
                    50: [1, 26],
                    52: [1, 25],
                    53: 24
                }, {
                    4: 28,
                    6: 3,
                    12: [2, 38],
                    13: [2, 38],
                    16: [2, 38],
                    24: [2, 38],
                    26: [2, 38],
                    28: [2, 38],
                    29: [2, 38],
                    31: [2, 38],
                    32: [2, 38],
                    34: [2, 38]
                }, {
                    4: 29,
                    6: 3,
                    12: [2, 38],
                    13: [2, 38],
                    16: [2, 38],
                    24: [2, 38],
                    26: [2, 38],
                    28: [2, 38],
                    29: [2, 38],
                    31: [2, 38],
                    32: [2, 38],
                    34: [2, 38]
                }, { 12: [1, 30] }, { 30: 32, 35: 31, 42: [1, 33], 43: [1, 34], 50: [1, 26], 53: 24 }, {
                    17: 35,
                    30: 22,
                    41: 23,
                    50: [1, 26],
                    52: [1, 25],
                    53: 24
                }, { 17: 36, 30: 22, 41: 23, 50: [1, 26], 52: [1, 25], 53: 24 }, {
                    17: 37,
                    30: 22,
                    41: 23,
                    50: [1, 26],
                    52: [1, 25],
                    53: 24
                }, { 25: [1, 38] }, {
                    18: [2, 48],
                    25: [2, 48],
                    33: [2, 48],
                    39: 39,
                    42: [2, 48],
                    43: [2, 48],
                    44: [2, 48],
                    45: [2, 48],
                    46: [2, 48],
                    50: [2, 48],
                    52: [2, 48]
                }, { 18: [2, 22], 25: [2, 22], 33: [2, 22], 46: [2, 22] }, {
                    18: [2, 35],
                    25: [2, 35],
                    33: [2, 35],
                    42: [2, 35],
                    43: [2, 35],
                    44: [2, 35],
                    45: [2, 35],
                    46: [2, 35],
                    50: [2, 35],
                    52: [2, 35],
                    54: [1, 40]
                }, { 30: 41, 50: [1, 26], 53: 24 }, {
                    18: [2, 37],
                    25: [2, 37],
                    33: [2, 37],
                    42: [2, 37],
                    43: [2, 37],
                    44: [2, 37],
                    45: [2, 37],
                    46: [2, 37],
                    50: [2, 37],
                    52: [2, 37],
                    54: [2, 37]
                }, { 33: [1, 42] }, { 20: 43, 27: 44, 28: [1, 45], 29: [2, 40] }, {
                    23: 46,
                    27: 47,
                    28: [1, 45],
                    29: [2, 42]
                }, { 15: [1, 48] }, {
                    25: [2, 46],
                    30: 51,
                    36: 49,
                    38: 50,
                    41: 55,
                    42: [1, 52],
                    43: [1, 53],
                    44: [1, 54],
                    45: [1, 56],
                    47: 57,
                    48: 58,
                    49: 60,
                    50: [1, 59],
                    52: [1, 25],
                    53: 24
                }, {
                    25: [2, 31],
                    42: [2, 31],
                    43: [2, 31],
                    44: [2, 31],
                    45: [2, 31],
                    50: [2, 31],
                    52: [2, 31]
                }, {
                    25: [2, 32],
                    42: [2, 32],
                    43: [2, 32],
                    44: [2, 32],
                    45: [2, 32],
                    50: [2, 32],
                    52: [2, 32]
                }, {
                    25: [2, 33],
                    42: [2, 33],
                    43: [2, 33],
                    44: [2, 33],
                    45: [2, 33],
                    50: [2, 33],
                    52: [2, 33]
                }, { 25: [1, 61] }, { 25: [1, 62] }, { 18: [1, 63] }, {
                    5: [2, 17],
                    12: [2, 17],
                    13: [2, 17],
                    16: [2, 17],
                    24: [2, 17],
                    26: [2, 17],
                    28: [2, 17],
                    29: [2, 17],
                    31: [2, 17],
                    32: [2, 17],
                    34: [2, 17]
                }, {
                    18: [2, 50],
                    25: [2, 50],
                    30: 51,
                    33: [2, 50],
                    36: 65,
                    40: 64,
                    41: 55,
                    42: [1, 52],
                    43: [1, 53],
                    44: [1, 54],
                    45: [1, 56],
                    46: [2, 50],
                    47: 66,
                    48: 58,
                    49: 60,
                    50: [1, 59],
                    52: [1, 25],
                    53: 24
                }, { 50: [1, 67] }, {
                    18: [2, 34],
                    25: [2, 34],
                    33: [2, 34],
                    42: [2, 34],
                    43: [2, 34],
                    44: [2, 34],
                    45: [2, 34],
                    46: [2, 34],
                    50: [2, 34],
                    52: [2, 34]
                }, {
                    5: [2, 18],
                    12: [2, 18],
                    13: [2, 18],
                    16: [2, 18],
                    24: [2, 18],
                    26: [2, 18],
                    28: [2, 18],
                    29: [2, 18],
                    31: [2, 18],
                    32: [2, 18],
                    34: [2, 18]
                }, { 21: 68, 29: [1, 69] }, { 29: [2, 41] }, {
                    4: 70,
                    6: 3,
                    12: [2, 38],
                    13: [2, 38],
                    16: [2, 38],
                    24: [2, 38],
                    26: [2, 38],
                    29: [2, 38],
                    31: [2, 38],
                    32: [2, 38],
                    34: [2, 38]
                }, { 21: 71, 29: [1, 69] }, { 29: [2, 43] }, {
                    5: [2, 9],
                    12: [2, 9],
                    13: [2, 9],
                    16: [2, 9],
                    24: [2, 9],
                    26: [2, 9],
                    28: [2, 9],
                    29: [2, 9],
                    31: [2, 9],
                    32: [2, 9],
                    34: [2, 9]
                }, { 25: [2, 44], 37: 72, 47: 73, 48: 58, 49: 60, 50: [1, 74] }, { 25: [1, 75] }, {
                    18: [2, 23],
                    25: [2, 23],
                    33: [2, 23],
                    42: [2, 23],
                    43: [2, 23],
                    44: [2, 23],
                    45: [2, 23],
                    46: [2, 23],
                    50: [2, 23],
                    52: [2, 23]
                }, {
                    18: [2, 24],
                    25: [2, 24],
                    33: [2, 24],
                    42: [2, 24],
                    43: [2, 24],
                    44: [2, 24],
                    45: [2, 24],
                    46: [2, 24],
                    50: [2, 24],
                    52: [2, 24]
                }, {
                    18: [2, 25],
                    25: [2, 25],
                    33: [2, 25],
                    42: [2, 25],
                    43: [2, 25],
                    44: [2, 25],
                    45: [2, 25],
                    46: [2, 25],
                    50: [2, 25],
                    52: [2, 25]
                }, {
                    18: [2, 26],
                    25: [2, 26],
                    33: [2, 26],
                    42: [2, 26],
                    43: [2, 26],
                    44: [2, 26],
                    45: [2, 26],
                    46: [2, 26],
                    50: [2, 26],
                    52: [2, 26]
                }, {
                    18: [2, 27],
                    25: [2, 27],
                    33: [2, 27],
                    42: [2, 27],
                    43: [2, 27],
                    44: [2, 27],
                    45: [2, 27],
                    46: [2, 27],
                    50: [2, 27],
                    52: [2, 27]
                }, { 17: 76, 30: 22, 41: 23, 50: [1, 26], 52: [1, 25], 53: 24 }, { 25: [2, 47] }, {
                    18: [2, 29],
                    25: [2, 29],
                    33: [2, 29],
                    46: [2, 29],
                    49: 77,
                    50: [1, 74]
                }, {
                    18: [2, 37],
                    25: [2, 37],
                    33: [2, 37],
                    42: [2, 37],
                    43: [2, 37],
                    44: [2, 37],
                    45: [2, 37],
                    46: [2, 37],
                    50: [2, 37],
                    51: [1, 78],
                    52: [2, 37],
                    54: [2, 37]
                }, { 18: [2, 52], 25: [2, 52], 33: [2, 52], 46: [2, 52], 50: [2, 52] }, {
                    12: [2, 13],
                    13: [2, 13],
                    16: [2, 13],
                    24: [2, 13],
                    26: [2, 13],
                    28: [2, 13],
                    29: [2, 13],
                    31: [2, 13],
                    32: [2, 13],
                    34: [2, 13]
                }, {
                    12: [2, 14],
                    13: [2, 14],
                    16: [2, 14],
                    24: [2, 14],
                    26: [2, 14],
                    28: [2, 14],
                    29: [2, 14],
                    31: [2, 14],
                    32: [2, 14],
                    34: [2, 14]
                }, { 12: [2, 10] }, { 18: [2, 21], 25: [2, 21], 33: [2, 21], 46: [2, 21] }, {
                    18: [2, 49],
                    25: [2, 49],
                    33: [2, 49],
                    42: [2, 49],
                    43: [2, 49],
                    44: [2, 49],
                    45: [2, 49],
                    46: [2, 49],
                    50: [2, 49],
                    52: [2, 49]
                }, { 18: [2, 51], 25: [2, 51], 33: [2, 51], 46: [2, 51] }, {
                    18: [2, 36],
                    25: [2, 36],
                    33: [2, 36],
                    42: [2, 36],
                    43: [2, 36],
                    44: [2, 36],
                    45: [2, 36],
                    46: [2, 36],
                    50: [2, 36],
                    52: [2, 36],
                    54: [2, 36]
                }, {
                    5: [2, 11],
                    12: [2, 11],
                    13: [2, 11],
                    16: [2, 11],
                    24: [2, 11],
                    26: [2, 11],
                    28: [2, 11],
                    29: [2, 11],
                    31: [2, 11],
                    32: [2, 11],
                    34: [2, 11]
                }, { 30: 79, 50: [1, 26], 53: 24 }, { 29: [2, 15] }, {
                    5: [2, 12],
                    12: [2, 12],
                    13: [2, 12],
                    16: [2, 12],
                    24: [2, 12],
                    26: [2, 12],
                    28: [2, 12],
                    29: [2, 12],
                    31: [2, 12],
                    32: [2, 12],
                    34: [2, 12]
                }, { 25: [1, 80] }, { 25: [2, 45] }, { 51: [1, 78] }, {
                    5: [2, 20],
                    12: [2, 20],
                    13: [2, 20],
                    16: [2, 20],
                    24: [2, 20],
                    26: [2, 20],
                    28: [2, 20],
                    29: [2, 20],
                    31: [2, 20],
                    32: [2, 20],
                    34: [2, 20]
                }, { 46: [1, 81] }, { 18: [2, 53], 25: [2, 53], 33: [2, 53], 46: [2, 53], 50: [2, 53] }, {
                    30: 51,
                    36: 82,
                    41: 55,
                    42: [1, 52],
                    43: [1, 53],
                    44: [1, 54],
                    45: [1, 56],
                    50: [1, 26],
                    52: [1, 25],
                    53: 24
                }, { 25: [1, 83] }, {
                    5: [2, 19],
                    12: [2, 19],
                    13: [2, 19],
                    16: [2, 19],
                    24: [2, 19],
                    26: [2, 19],
                    28: [2, 19],
                    29: [2, 19],
                    31: [2, 19],
                    32: [2, 19],
                    34: [2, 19]
                }, {
                    18: [2, 28],
                    25: [2, 28],
                    33: [2, 28],
                    42: [2, 28],
                    43: [2, 28],
                    44: [2, 28],
                    45: [2, 28],
                    46: [2, 28],
                    50: [2, 28],
                    52: [2, 28]
                }, { 18: [2, 30], 25: [2, 30], 33: [2, 30], 46: [2, 30], 50: [2, 30] }, {
                    5: [2, 16],
                    12: [2, 16],
                    13: [2, 16],
                    16: [2, 16],
                    24: [2, 16],
                    26: [2, 16],
                    28: [2, 16],
                    29: [2, 16],
                    31: [2, 16],
                    32: [2, 16],
                    34: [2, 16]
                }],
                defaultActions: {
                    4: [2, 1],
                    44: [2, 41],
                    47: [2, 43],
                    57: [2, 47],
                    63: [2, 10],
                    70: [2, 15],
                    73: [2, 45]
                },
                parseError: function (n) {
                    throw new Error(n);
                },
                parse: function (n) {
                    function it() {
                        var n;
                        return n = k.lexer.lex() || 1, typeof n != "number" && (n = k.symbols_[n] || n), n
                    }

                    var k = this, r = [0], f = [null], t = [], h = this.table, d = "", c = 0, g = 0, y = 0, l, nt, i, p,
                        o, u, w, s, a, e, tt, v, b;
                    for (this.lexer.setInput(n), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, typeof this.lexer.yylloc == "undefined" && (this.lexer.yylloc = {}), l = this.lexer.yylloc, t.push(l), nt = this.lexer.options && this.lexer.options.ranges, typeof this.yy.parseError == "function" && (this.parseError = this.yy.parseError), s = {}; ;) {
                        if (o = r[r.length - 1], this.defaultActions[o] ? u = this.defaultActions[o] : ((i === null || typeof i == "undefined") && (i = it()), u = h[o] && h[o][i]), (typeof u == "undefined" || !u.length || !u[0]) && (b = "", !y)) {
                            v = [];
                            for (a in h[o]) this.terminals_[a] && a > 2 && v.push("'" + this.terminals_[a] + "'");
                            b = this.lexer.showPosition ? "Parse error on line " + (c + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + v.join(", ") + ", got '" + (this.terminals_[i] || i) + "'" : "Parse error on line " + (c + 1) + ": Unexpected " + (i == 1 ? "end of input" : "'" + (this.terminals_[i] || i) + "'");
                            this.parseError(b, {
                                text: this.lexer.match,
                                token: this.terminals_[i] || i,
                                line: this.lexer.yylineno,
                                loc: l,
                                expected: v
                            })
                        }
                        if (u[0] instanceof Array && u.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + o + ", token: " + i);
                        switch (u[0]) {
                            case 1:
                                r.push(i);
                                f.push(this.lexer.yytext);
                                t.push(this.lexer.yylloc);
                                r.push(u[1]);
                                i = null;
                                p ? (i = p, p = null) : (g = this.lexer.yyleng, d = this.lexer.yytext, c = this.lexer.yylineno, l = this.lexer.yylloc, y > 0 && y--);
                                break;
                            case 2:
                                if (e = this.productions_[u[1]][1], s.$ = f[f.length - e], s._$ = {
                                    first_line: t[t.length - (e || 1)].first_line,
                                    last_line: t[t.length - 1].last_line,
                                    first_column: t[t.length - (e || 1)].first_column,
                                    last_column: t[t.length - 1].last_column
                                }, nt && (s._$.range = [t[t.length - (e || 1)].range[0], t[t.length - 1].range[1]]), w = this.performAction.call(s, d, g, c, this.yy, u[1], f, t), typeof w != "undefined") return w;
                                e && (r = r.slice(0, -2 * e), f = f.slice(0, -1 * e), t = t.slice(0, -1 * e));
                                r.push(this.productions_[u[1]][0]);
                                f.push(s.$);
                                t.push(s._$);
                                tt = h[r[r.length - 2]][r[r.length - 1]];
                                r.push(tt);
                                break;
                            case 3:
                                return !0
                        }
                    }
                    return !0
                }
            }, i = function () {
                var n = {
                    EOF: 1, parseError: function (n, t) {
                        if (this.yy.parser) this.yy.parser.parseError(n, t); else throw new Error(n);
                    }, setInput: function (n) {
                        return this._input = n, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = {
                            first_line: 1,
                            first_column: 0,
                            last_line: 1,
                            last_column: 0
                        }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this
                    }, input: function () {
                        var n = this._input[0], t;
                        return this.yytext += n, this.yyleng++ , this.offset++ , this.match += n, this.matched += n, t = n.match(/(?:\r\n?|\n).*/g), t ? (this.yylineno++ , this.yylloc.last_line++) : this.yylloc.last_column++ , this.options.ranges && this.yylloc.range[1]++ , this._input = this._input.slice(1), n
                    }, unput: function (n) {
                        var i = n.length, t = n.split(/(?:\r\n?|\n)/g), r, u;
                        return this._input = n + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - i - 1), this.offset -= i, r = this.match.split(/(?:\r\n?|\n)/g), this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), t.length - 1 && (this.yylineno -= t.length - 1), u = this.yylloc.range, this.yylloc = {
                            first_line: this.yylloc.first_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.first_column,
                            last_column: t ? (t.length === r.length ? this.yylloc.first_column : 0) + r[r.length - t.length].length - t[0].length : this.yylloc.first_column - i
                        }, this.options.ranges && (this.yylloc.range = [u[0], u[0] + this.yyleng - i]), this
                    }, more: function () {
                        return this._more = !0, this
                    }, less: function (n) {
                        this.unput(this.match.slice(n))
                    }, pastInput: function () {
                        var n = this.matched.substr(0, this.matched.length - this.match.length);
                        return (n.length > 20 ? "..." : "") + n.substr(-20).replace(/\n/g, "")
                    }, upcomingInput: function () {
                        var n = this.match;
                        return n.length < 20 && (n += this._input.substr(0, 20 - n.length)), (n.substr(0, 20) + (n.length > 20 ? "..." : "")).replace(/\n/g, "")
                    }, showPosition: function () {
                        var n = this.pastInput(), t = new Array(n.length + 1).join("-");
                        return n + this.upcomingInput() + "\n" + t + "^"
                    }, next: function () {
                        var f, n, r, e, t, u, i;
                        if (this.done) return this.EOF;
                        for (this._input || (this.done = !0), this._more || (this.yytext = "", this.match = ""), u = this._currentRules(), i = 0; i < u.length; i++) if (r = this._input.match(this.rules[u[i]]), r && (!n || r[0].length > n[0].length) && (n = r, e = i, !this.options.flex)) break;
                        return n ? (t = n[0].match(/(?:\r\n?|\n).*/g), t && (this.yylineno += t.length), this.yylloc = {
                            first_line: this.yylloc.last_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.last_column,
                            last_column: t ? t[t.length - 1].length - t[t.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + n[0].length
                        }, this.yytext += n[0], this.match += n[0], this.matches = n, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._input = this._input.slice(n[0].length), this.matched += n[0], f = this.performAction.call(this, this.yy, this, u[e], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), f) ? f : void 0 : this._input === "" ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                            text: "",
                            token: null,
                            line: this.yylineno
                        })
                    }, lex: function () {
                        var n = this.next();
                        return typeof n != "undefined" ? n : this.lex()
                    }, begin: function (n) {
                        this.conditionStack.push(n)
                    }, popState: function () {
                        return this.conditionStack.pop()
                    }, _currentRules: function () {
                        return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
                    }, topState: function () {
                        return this.conditionStack[this.conditionStack.length - 2]
                    }, pushState: function (n) {
                        this.begin(n)
                    }
                };
                return n.options = {}, n.performAction = function (n, t, i, r) {
                    function u(n, i) {
                        return t.yytext = t.yytext.substr(n, t.yyleng - i)
                    }

                    var f = r;
                    switch (i) {
                        case 0:
                            if (t.yytext.slice(-2) === "\\\\" ? (u(0, 1), this.begin("mu")) : t.yytext.slice(-1) === "\\" ? (u(0, 1), this.begin("emu")) : this.begin("mu"), t.yytext) return 12;
                            break;
                        case 1:
                            return 12;
                        case 2:
                            return this.popState(), 12;
                        case 3:
                            return t.yytext = t.yytext.substr(5, t.yyleng - 9), this.popState(), 15;
                        case 4:
                            return 12;
                        case 5:
                            return u(0, 4), this.popState(), 13;
                        case 6:
                            return 45;
                        case 7:
                            return 46;
                        case 8:
                            return 16;
                        case 9:
                            return this.popState(), this.begin("raw"), 18;
                        case 10:
                            return 34;
                        case 11:
                            return 24;
                        case 12:
                            return 29;
                        case 13:
                            return this.popState(), 28;
                        case 14:
                            return this.popState(), 28;
                        case 15:
                            return 26;
                        case 16:
                            return 26;
                        case 17:
                            return 32;
                        case 18:
                            return 31;
                        case 19:
                            this.popState();
                            this.begin("com");
                            break;
                        case 20:
                            return u(3, 5), this.popState(), 13;
                        case 21:
                            return 31;
                        case 22:
                            return 51;
                        case 23:
                            return 50;
                        case 24:
                            return 50;
                        case 25:
                            return 54;
                        case 27:
                            return this.popState(), 33;
                        case 28:
                            return this.popState(), 25;
                        case 29:
                            return t.yytext = u(1, 2).replace(/\\"/g, '"'), 42;
                        case 30:
                            return t.yytext = u(1, 2).replace(/\\'/g, "'"), 42;
                        case 31:
                            return 52;
                        case 32:
                            return 44;
                        case 33:
                            return 44;
                        case 34:
                            return 43;
                        case 35:
                            return 50;
                        case 36:
                            return t.yytext = u(1, 2), 50;
                        case 37:
                            return "INVALID";
                        case 38:
                            return 5
                    }
                }, n.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]*?(?=(\{\{\{\{\/)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{(~)?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)]))))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/], n.conditions = {
                    mu: {
                        rules: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
                        inclusive: !1
                    },
                    emu: { rules: [2], inclusive: !1 },
                    com: { rules: [5], inclusive: !1 },
                    raw: { rules: [3, 4], inclusive: !1 },
                    INITIAL: { rules: [0, 1, 38], inclusive: !0 }
                }, n
            }();
            return n.lexer = i, t.prototype = n, n.Parser = t, new t
        }()
    }(), s = function (n) {
        "use strict";

        function o(n, t) {
            return { left: n.charAt(2) === "~", right: t.charAt(t.length - 3) === "~" }
        }

        function s(n, r, o, s, h, c) {
            var l, a, v;
            if (n.sexpr.id.original !== s.path.original) throw new e(n.sexpr.id.original + " doesn't match " + s.path.original, n);
            return l = o && o.program, a = {
                left: n.strip.left,
                right: s.strip.right,
                openStandalone: f(r.statements),
                closeStandalone: u((l || r).statements)
            }, n.strip.right && i(r.statements, null, !0), l ? (v = o.strip, v.left && t(r.statements, null, !0), v.right && i(l.statements, null, !0), s.strip.left && t(l.statements, null, !0), u(r.statements) && f(l.statements) && (t(r.statements), i(l.statements))) : s.strip.left && t(r.statements, null, !0), h ? new this.BlockNode(n, l, r, a, c) : new this.BlockNode(n, r, l, a, c)
        }

        function h(n, r) {
            for (var o, s, e = 0, h = n.length; e < h; e++) if (o = n[e], s = o.strip, s) {
                var c = u(n, e, r, o.type === "partial"), l = f(n, e, r), a = s.openStandalone && c,
                    v = s.closeStandalone && l, y = s.inlineStandalone && c && l;
                s.right && i(n, e, !0);
                s.left && t(n, e, !0);
                y && (i(n, e), t(n, e) && o.type === "partial" && (o.indent = /([ \t]+$)/.exec(n[e - 1].original) ? RegExp.$1 : ""));
                a && (i((o.program || o.inverse).statements), t(n, e));
                v && (i(n, e), t((o.inverse || o.program).statements))
            }
            return n
        }

        function u(n, t, i) {
            t === undefined && (t = n.length);
            var r = n[t - 1], u = n[t - 2];
            return r ? r.type === "content" ? (u || !i ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(r.original) : void 0 : i
        }

        function f(n, t, i) {
            t === undefined && (t = -1);
            var r = n[t + 1], u = n[t + 2];
            return r ? r.type === "content" ? (u || !i ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(r.original) : void 0 : i
        }

        function i(n, t, i) {
            var r = n[t == null ? 0 : t + 1], u;
            r && r.type === "content" && (i || !r.rightStripped) && (u = r.string, r.string = r.string.replace(i ? /^\s+/ : /^[ \t]*\r?\n?/, ""), r.rightStripped = r.string !== u)
        }

        function t(n, t, i) {
            var r = n[t == null ? n.length - 1 : t - 1], u;
            if (r && r.type === "content" && (i || !r.leftStripped)) return u = r.string, r.string = r.string.replace(i ? /\s+$/ : /[ \t]+$/, ""), r.leftStripped = r.string !== u, r.leftStripped
        }

        var r = {}, e = n;
        return r.stripFlags = o, r.prepareBlock = s, r.prepareProgram = h, r
    }(n), h = function (n, t, i, r) {
        "use strict";

        function c(n) {
            return n.constructor === o.ProgramNode ? n : (f.yy = e, f.parse(n))
        }

        var u = {}, f = n, o = t, s = i, h = r.extend, e;
        return u.parser = f, e = {}, h(e, s, o), u.parse = c, u
    }(o, u, s, t), c = function (n, t) {
        "use strict";

        function u() {
        }

        function s(n, t, i) {
            if (n == null || typeof n != "string" && n.constructor !== i.AST.ProgramNode) throw new r("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + n);
            t = t || {};
            "data" in t || (t.data = !0);
            t.compat && (t.useDepths = !0);
            var u = i.parse(n), f = (new i.Compiler).compile(u, t);
            return (new i.JavaScriptCompiler).compile(f, t)
        }

        function h(n, t, i) {
            function e() {
                var r = i.parse(n), u = (new i.Compiler).compile(r, t),
                    f = (new i.JavaScriptCompiler).compile(u, t, undefined, !0);
                return i.template(f)
            }

            var u, f;
            if (n == null || typeof n != "string" && n.constructor !== i.AST.ProgramNode) throw new r("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + n);
            return t = t || {}, "data" in t || (t.data = !0), t.compat && (t.useDepths = !0), f = function (n, t) {
                return u || (u = e()), u.call(this, n, t)
            }, f._setup = function (n) {
                return u || (u = e()), u._setup(n)
            }, f._child = function (n, t, i) {
                return u || (u = e()), u._child(n, t, i)
            }, f
        }

        function e(n, t) {
            if (n === t) return !0;
            if (f(n) && f(t) && n.length === t.length) {
                for (var i = 0; i < n.length; i++) if (!e(n[i], t[i])) return !1;
                return !0
            }
        }

        var i = {}, r = n, f = t.isArray, o = [].slice;
        return i.Compiler = u, u.prototype = {
            compiler: u, equals: function (n) {
                var i = this.opcodes.length, t, r, u;
                if (n.opcodes.length !== i) return !1;
                for (t = 0; t < i; t++) if (r = this.opcodes[t], u = n.opcodes[t], r.opcode !== u.opcode || !e(r.args, u.args)) return !1;
                for (i = this.children.length, t = 0; t < i; t++) if (!this.children[t].equals(n.children[t])) return !1;
                return !0
            }, guid: 0, compile: function (n, t) {
                var i, r;
                if (this.opcodes = [], this.children = [], this.depths = { list: [] }, this.options = t, this.stringParams = t.stringParams, this.trackIds = t.trackIds, i = this.options.knownHelpers, this.options.knownHelpers = {
                    helperMissing: !0,
                    blockHelperMissing: !0,
                    each: !0,
                    "if": !0,
                    unless: !0,
                    "with": !0,
                    log: !0,
                    lookup: !0
                }, i) for (r in i) this.options.knownHelpers[r] = i[r];
                return this.accept(n)
            }, accept: function (n) {
                return this[n.type](n)
            }, program: function (n) {
                for (var i = n.statements, t = 0, r = i.length; t < r; t++) this.accept(i[t]);
                return this.isSimple = r === 1, this.depths.list = this.depths.list.sort(function (n, t) {
                    return n - t
                }), this
            }, compileProgram: function (n) {
                var t = (new this.compiler).compile(n, this.options), u = this.guid++, r, i, f;
                for (this.usePartial = this.usePartial || t.usePartial, this.children[u] = t, i = 0, f = t.depths.list.length; i < f; i++) if (r = t.depths.list[i], r < 2) continue; else this.addDepth(r - 1);
                return u
            }, block: function (n) {
                var f = n.mustache, t = n.program, i = n.inverse, r, u;
                t && (t = this.compileProgram(t));
                i && (i = this.compileProgram(i));
                r = f.sexpr;
                u = this.classifySexpr(r);
                u === "helper" ? this.helperSexpr(r, t, i) : u === "simple" ? (this.simpleSexpr(r), this.opcode("pushProgram", t), this.opcode("pushProgram", i), this.opcode("emptyHash"), this.opcode("blockValue", r.id.original)) : (this.ambiguousSexpr(r, t, i), this.opcode("pushProgram", t), this.opcode("pushProgram", i), this.opcode("emptyHash"), this.opcode("ambiguousBlockValue"));
                this.opcode("append")
            }, hash: function (n) {
                var i = n.pairs, t, r;
                for (this.opcode("pushHash"), t = 0, r = i.length; t < r; t++) this.pushParam(i[t][1]);
                while (t--) this.opcode("assignToHash", i[t][0]);
                this.opcode("popHash")
            }, partial: function (n) {
                var t = n.partialName;
                this.usePartial = !0;
                n.hash ? this.accept(n.hash) : this.opcode("push", "undefined");
                n.context ? this.accept(n.context) : (this.opcode("getContext", 0), this.opcode("pushContext"));
                this.opcode("invokePartial", t.name, n.indent || "");
                this.opcode("append")
            }, content: function (n) {
                n.string && this.opcode("appendContent", n.string)
            }, mustache: function (n) {
                this.sexpr(n.sexpr);
                n.escaped && !this.options.noEscape ? this.opcode("appendEscaped") : this.opcode("append")
            }, ambiguousSexpr: function (n, t, i) {
                var r = n.id, u = r.parts[0], f = t != null || i != null;
                this.opcode("getContext", r.depth);
                this.opcode("pushProgram", t);
                this.opcode("pushProgram", i);
                this.ID(r);
                this.opcode("invokeAmbiguous", u, f)
            }, simpleSexpr: function (n) {
                var t = n.id;
                t.type === "DATA" ? this.DATA(t) : t.parts.length ? this.ID(t) : (this.addDepth(t.depth), this.opcode("getContext", t.depth), this.opcode("pushContext"));
                this.opcode("resolvePossibleLambda")
            }, helperSexpr: function (n, t, i) {
                var e = this.setupFullMustacheParams(n, t, i), u = n.id, f = u.parts[0];
                if (this.options.knownHelpers[f]) this.opcode("invokeKnownHelper", e.length, f); else if (this.options.knownHelpersOnly) throw new r("You specified knownHelpersOnly, but used the unknown helper " + f, n); else u.falsy = !0, this.ID(u), this.opcode("invokeHelper", e.length, u.original, u.isSimple)
            }, sexpr: function (n) {
                var t = this.classifySexpr(n);
                t === "simple" ? this.simpleSexpr(n) : t === "helper" ? this.helperSexpr(n) : this.ambiguousSexpr(n)
            }, ID: function (n) {
                this.addDepth(n.depth);
                this.opcode("getContext", n.depth);
                var t = n.parts[0];
                t ? this.opcode("lookupOnContext", n.parts, n.falsy, n.isScoped) : this.opcode("pushContext")
            }, DATA: function (n) {
                this.options.data = !0;
                this.opcode("lookupData", n.id.depth, n.id.parts)
            }, STRING: function (n) {
                this.opcode("pushString", n.string)
            }, NUMBER: function (n) {
                this.opcode("pushLiteral", n.number)
            }, BOOLEAN: function (n) {
                this.opcode("pushLiteral", n.bool)
            }, comment: function () {
            }, opcode: function (n) {
                this.opcodes.push({ opcode: n, args: o.call(arguments, 1) })
            }, addDepth: function (n) {
                n !== 0 && (this.depths[n] || (this.depths[n] = !0, this.depths.list.push(n)))
            }, classifySexpr: function (n) {
                var t = n.isHelper, i = n.eligibleHelper, r = this.options, u;
                return i && !t && (u = n.id.parts[0], r.knownHelpers[u] ? t = !0 : r.knownHelpersOnly && (i = !1)), t ? "helper" : i ? "ambiguous" : "simple"
            }, pushParams: function (n) {
                for (var t = 0, i = n.length; t < i; t++) this.pushParam(n[t])
            }, pushParam: function (n) {
                this.stringParams ? (n.depth && this.addDepth(n.depth), this.opcode("getContext", n.depth || 0), this.opcode("pushStringParam", n.stringModeValue, n.type), n.type === "sexpr" && this.sexpr(n)) : (this.trackIds && this.opcode("pushId", n.type, n.idName || n.stringModeValue), this.accept(n))
            }, setupFullMustacheParams: function (n, t, i) {
                var r = n.params;
                return this.pushParams(r), this.opcode("pushProgram", t), this.opcode("pushProgram", i), n.hash ? this.hash(n.hash) : this.opcode("emptyHash"), r
            }
        }, i.precompile = s, i.compile = h, i
    }(n, t), l = function (n, t) {
        "use strict";

        function r(n) {
            this.value = n
        }

        function i() {
        }

        var h = n.COMPILER_REVISION, c = n.REVISION_CHANGES, f = t, e, o, u, s;
        for (i.prototype = {
            nameLookup: function (n, t) {
                return i.isValidJavaScriptVariableName(t) ? n + "." + t : n + "['" + t + "']"
            }, depthedLookup: function (n) {
                return this.aliases.lookup = "this.lookup", 'lookup(depths, "' + n + '")'
            }, compilerInfo: function () {
                var n = h, t = c[n];
                return [n, t]
            }, appendToBuffer: function (n) {
                return this.environment.isSimple ? "return " + n + ";" : {
                    appendToBuffer: !0,
                    content: n,
                    toString: function () {
                        return "buffer += " + n + ";"
                    }
                }
            }, initializeBuffer: function () {
                return this.quotedString("")
            }, namespace: "Handlebars", compile: function (n, t, i, r) {
                var h, c, e, o, l, u, s;
                for (this.environment = n, this.options = t, this.stringParams = this.options.stringParams, this.trackIds = this.options.trackIds, this.precompile = !r, this.name = this.environment.name, this.isChild = !!i, this.context = i || {
                    programs: [],
                    environments: []
                }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.aliases = {}, this.registers = { list: [] }, this.hashes = [], this.compileStack = [], this.inlineStack = [], this.compileChildren(n, t), this.useDepths = this.useDepths || n.depths.list.length || this.options.compat, h = n.opcodes, e = 0, o = h.length; e < o; e++) c = h[e], this[c.opcode].apply(this, c.args);
                if (this.pushSource(""), this.stackSlot || this.inlineStack.length || this.compileStack.length) throw new f("Compile completed with content left on stack");
                if (l = this.createFunctionContext(r), this.isChild) return l;
                for (u = {
                    compiler: this.compilerInfo(),
                    main: l
                }, s = this.context.programs, e = 0, o = s.length; e < o; e++) s[e] && (u[e] = s[e]);
                return this.environment.usePartial && (u.usePartial = !0), this.options.data && (u.useData = !0), this.useDepths && (u.useDepths = !0), this.options.compat && (u.compat = !0), r || (u.compiler = JSON.stringify(u.compiler), u = this.objectLiteral(u)), u
            }, preamble: function () {
                this.lastContext = 0;
                this.source = []
            }, createFunctionContext: function (n) {
                var r = "", f = this.stackVars.concat(this.registers.list), i, t, u;
                f.length > 0 && (r += ", " + f.join(", "));
                for (i in this.aliases) this.aliases.hasOwnProperty(i) && (r += ", " + i + "=" + this.aliases[i]);
                return t = ["depth0", "helpers", "partials", "data"], this.useDepths && t.push("depths"), u = this.mergeSource(r), n ? (t.push(u), Function.apply(this, t)) : "function(" + t.join(",") + ") {\n  " + u + "}"
            }, mergeSource: function (n) {
                for (var r, i = "", t, e = !this.forceBuffer, u, f = 0, o = this.source.length; f < o; f++) r = this.source[f], r.appendToBuffer ? t = t ? t + "\n    + " + r.content : r.content : (t && (i ? i += "buffer += " + t + ";\n  " : (u = !0, i = t + ";\n  "), t = undefined), i += r + "\n  ", this.environment.isSimple || (e = !1));
                return e ? (t || !i) && (i += "return " + (t || '""') + ";\n") : (n += ", buffer = " + (u ? "" : this.initializeBuffer()), i += t ? "return buffer + " + t + ";\n" : "return buffer;\n"), n && (i = "var " + n.substring(2) + (u ? "" : ";\n  ") + i), i
            }, blockValue: function (n) {
                var t, i;
                this.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                t = [this.contextName(0)];
                this.setupParams(n, 0, t);
                i = this.popStack();
                t.splice(1, 0, i);
                this.push("blockHelperMissing.call(" + t.join(", ") + ")")
            }, ambiguousBlockValue: function () {
                var n, t;
                this.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                n = [this.contextName(0)];
                this.setupParams("", 0, n, !0);
                this.flushInline();
                t = this.topStack();
                n.splice(1, 0, t);
                this.pushSource("if (!" + this.lastHelper + ") { " + t + " = blockHelperMissing.call(" + n.join(", ") + "); }")
            }, appendContent: function (n) {
                this.pendingContent && (n = this.pendingContent + n);
                this.pendingContent = n
            }, append: function () {
                this.flushInline();
                var n = this.popStack();
                this.pushSource("if (" + n + " != null) { " + this.appendToBuffer(n) + " }");
                this.environment.isSimple && this.pushSource("else { " + this.appendToBuffer("''") + " }")
            }, appendEscaped: function () {
                this.aliases.escapeExpression = "this.escapeExpression";
                this.pushSource(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"))
            }, getContext: function (n) {
                this.lastContext = n
            }, pushContext: function () {
                this.pushStackLiteral(this.contextName(this.lastContext))
            }, lookupOnContext: function (n, t, i) {
                var r = 0, u = n.length;
                for (i || !this.options.compat || this.lastContext ? this.pushContext() : this.push(this.depthedLookup(n[r++])); r < u; r++) this.replaceStack(function (i) {
                    var u = this.nameLookup(i, n[r], "context");
                    return t ? " && " + u : " != null ? " + u + " : " + i
                })
            }, lookupData: function (n, t) {
                var r, i;
                for (n ? this.pushStackLiteral("this.data(data, " + n + ")") : this.pushStackLiteral("data"), r = t.length, i = 0; i < r; i++) this.replaceStack(function (n) {
                    return " && " + this.nameLookup(n, t[i], "data")
                })
            }, resolvePossibleLambda: function () {
                this.aliases.lambda = "this.lambda";
                this.push("lambda(" + this.popStack() + ", " + this.contextName(0) + ")")
            }, pushStringParam: function (n, t) {
                this.pushContext();
                this.pushString(t);
                t !== "sexpr" && (typeof n == "string" ? this.pushString(n) : this.pushStackLiteral(n))
            }, emptyHash: function () {
                this.pushStackLiteral("{}");
                this.trackIds && this.push("{}");
                this.stringParams && (this.push("{}"), this.push("{}"))
            }, pushHash: function () {
                this.hash && this.hashes.push(this.hash);
                this.hash = { values: [], types: [], contexts: [], ids: [] }
            }, popHash: function () {
                var n = this.hash;
                this.hash = this.hashes.pop();
                this.trackIds && this.push("{" + n.ids.join(",") + "}");
                this.stringParams && (this.push("{" + n.contexts.join(",") + "}"), this.push("{" + n.types.join(",") + "}"));
                this.push("{\n    " + n.values.join(",\n    ") + "\n  }")
            }, pushString: function (n) {
                this.pushStackLiteral(this.quotedString(n))
            }, push: function (n) {
                return this.inlineStack.push(n), n
            }, pushLiteral: function (n) {
                this.pushStackLiteral(n)
            }, pushProgram: function (n) {
                n != null ? this.pushStackLiteral(this.programExpression(n)) : this.pushStackLiteral(null)
            }, invokeHelper: function (n, t, i) {
                this.aliases.helperMissing = "helpers.helperMissing";
                var u = this.popStack(), r = this.setupHelper(n, t),
                    f = (i ? r.name + " || " : "") + u + " || helperMissing";
                this.push("((" + f + ").call(" + r.callParams + "))")
            }, invokeKnownHelper: function (n, t) {
                var i = this.setupHelper(n, t);
                this.push(i.name + ".call(" + i.callParams + ")")
            }, invokeAmbiguous: function (n, t) {
                var r, i, u;
                this.aliases.functionType = '"function"';
                this.aliases.helperMissing = "helpers.helperMissing";
                this.useRegister("helper");
                r = this.popStack();
                this.emptyHash();
                i = this.setupHelper(0, n, t);
                u = this.lastHelper = this.nameLookup("helpers", n, "helper");
                this.push("((helper = (helper = " + u + " || " + r + ") != null ? helper : helperMissing" + (i.paramsInit ? "),(" + i.paramsInit : "") + "),(typeof helper === functionType ? helper.call(" + i.callParams + ") : helper))")
            }, invokePartial: function (n, t) {
                var i = [this.nameLookup("partials", n, "partial"), "'" + t + "'", "'" + n + "'", this.popStack(), this.popStack(), "helpers", "partials"];
                this.options.data ? i.push("data") : this.options.compat && i.push("undefined");
                this.options.compat && i.push("depths");
                this.push("this.invokePartial(" + i.join(", ") + ")")
            }, assignToHash: function (n) {
                var f = this.popStack(), i, r, u, t;
                this.trackIds && (u = this.popStack());
                this.stringParams && (r = this.popStack(), i = this.popStack());
                t = this.hash;
                i && t.contexts.push("'" + n + "': " + i);
                r && t.types.push("'" + n + "': " + r);
                u && t.ids.push("'" + n + "': " + u);
                t.values.push("'" + n + "': (" + f + ")")
            }, pushId: function (n, t) {
                n === "ID" || n === "DATA" ? this.pushString(t) : n === "sexpr" ? this.pushStackLiteral("true") : this.pushStackLiteral("null")
            }, compiler: i, compileChildren: function (n, t) {
                for (var i, e = n.children, r, u, f = 0, o = e.length; f < o; f++) r = e[f], u = new this.compiler, i = this.matchExistingProgram(r), i == null ? (this.context.programs.push(""), i = this.context.programs.length, r.index = i, r.name = "program" + i, this.context.programs[i] = u.compile(r, t, this.context, !this.precompile), this.context.environments[i] = r, this.useDepths = this.useDepths || u.useDepths) : (r.index = i, r.name = "program" + i)
            }, matchExistingProgram: function (n) {
                for (var i, t = 0, r = this.context.environments.length; t < r; t++) if (i = this.context.environments[t], i && i.equals(n)) return t
            }, programExpression: function (n) {
                var t = this.environment.children[n], u = t.depths.list, r = this.useDepths, i = [t.index, "data"];
                return r && i.push("depths"), "this.program(" + i.join(", ") + ")"
            }, useRegister: function (n) {
                this.registers[n] || (this.registers[n] = !0, this.registers.list.push(n))
            }, pushStackLiteral: function (n) {
                return this.push(new r(n))
            }, pushSource: function (n) {
                this.pendingContent && (this.source.push(this.appendToBuffer(this.quotedString(this.pendingContent))), this.pendingContent = undefined);
                n && this.source.push(n)
            }, pushStack: function (n) {
                this.flushInline();
                var t = this.incrStack();
                return this.pushSource(t + " = " + n + ";"), this.compileStack.push(t), t
            }, replaceStack: function (n) {
                var i = "", c = this.isInline(), u, e, o, t, s, h;
                if (!this.isInline()) throw new f("replaceStack on non-inline");
                t = this.popStack(!0);
                t instanceof r ? (i = u = t.value, o = !0) : (e = !this.stackSlot, s = e ? this.incrStack() : this.topStackName(), i = "(" + this.push(s) + " = " + t + ")", u = this.topStack());
                h = n.call(this, u);
                o || this.popStack();
                e && this.stackSlot--;
                this.push("(" + i + h + ")")
            }, incrStack: function () {
                return this.stackSlot++ , this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), this.topStackName()
            }, topStackName: function () {
                return "stack" + this.stackSlot
            }, flushInline: function () {
                var i = this.inlineStack, n, u, t;
                if (i.length) for (this.inlineStack = [], n = 0, u = i.length; n < u; n++) t = i[n], t instanceof r ? this.compileStack.push(t) : this.pushStack(t)
            }, isInline: function () {
                return this.inlineStack.length
            }, popStack: function (n) {
                var i = this.isInline(), t = (i ? this.inlineStack : this.compileStack).pop();
                if (!n && t instanceof r) return t.value;
                if (!i) {
                    if (!this.stackSlot) throw new f("Invalid stack pop");
                    this.stackSlot--
                }
                return t
            }, topStack: function () {
                var t = this.isInline() ? this.inlineStack : this.compileStack, n = t[t.length - 1];
                return n instanceof r ? n.value : n
            }, contextName: function (n) {
                return this.useDepths && n ? "depths[" + n + "]" : "depth" + n
            }, quotedString: function (n) {
                return '"' + n.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"'
            }, objectLiteral: function (n) {
                var i = [];
                for (var t in n) n.hasOwnProperty(t) && i.push(this.quotedString(t) + ":" + n[t]);
                return "{" + i.join(",") + "}"
            }, setupHelper: function (n, t, i) {
                var r = [], u = this.setupParams(t, n, r, i), f = this.nameLookup("helpers", t, "helper");
                return { params: r, paramsInit: u, name: f, callParams: [this.contextName(0)].concat(r).join(", ") }
            }, setupOptions: function (n, t, i) {
                var r = {}, o = [], s = [], h = [], c, f, e, u;
                for (r.name = this.quotedString(n), r.hash = this.popStack(), this.trackIds && (r.hashIds = this.popStack()), this.stringParams && (r.hashTypes = this.popStack(), r.hashContexts = this.popStack()), f = this.popStack(), e = this.popStack(), (e || f) && (e || (e = "this.noop"), f || (f = "this.noop"), r.fn = e, r.inverse = f), u = t; u--;) c = this.popStack(), i[u] = c, this.trackIds && (h[u] = this.popStack()), this.stringParams && (s[u] = this.popStack(), o[u] = this.popStack());
                return this.trackIds && (r.ids = "[" + h.join(",") + "]"), this.stringParams && (r.types = "[" + s.join(",") + "]", r.contexts = "[" + o.join(",") + "]"), this.options.data && (r.data = "data"), r
            }, setupParams: function (n, t, i, r) {
                var u = this.objectLiteral(this.setupOptions(n, t, i));
                return r ? (this.useRegister("options"), i.push("options"), "options=" + u) : (i.push(u), "")
            }
        }, e = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield".split(" "), o = i.RESERVED_WORDS = {}, u = 0, s = e.length; u < s; u++) o[e[u]] = !0;
        return i.isValidJavaScriptVariableName = function (n) {
            return !i.RESERVED_WORDS[n] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(n)
        }, i
    }(i, n);
    return function (n, t, i, r, u) {
        "use strict";
        var f = n, o = t, s = i.parser, h = i.parse, c = r.Compiler, l = r.compile, a = r.precompile, v = u,
            y = f.create, e = function () {
                var n = y();
                return n.compile = function (t, i) {
                    return l(t, i, n)
                }, n.precompile = function (t, i) {
                    return a(t, i, n)
                }, n.AST = o, n.Compiler = c, n.JavaScriptCompiler = v, n.Parser = s, n.parse = h, n
            };
        return f = e(), f.create = e, f["default"] = f, f
    }(e, u, h, c, l)
});
!function (n, t) {
    function u(t) {
        return t.map(function () {
            return this.elements ? n.makeArray(this.elements) : this
        }).filter(":input:not(:disabled)").get()
    }

    function f(i) {
        var u, r = {};
        return n.each(i, function (n, i) {
            u = r[i.name];
            u === t && (r[i.name] = []);
            r[i.name].push(i)
        }), r
    }

    var i = Array.prototype.push, e = /^(?:radio|checkbox)$/i, r = /\+/g,
        o = /^(?:option|select-one|select-multiple)$/i,
        s = /^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;
    n.fn.deserialize = function (h, c) {
        var a, tt, it = u(this), b = [], rt, y, ot;
        if (!h || !it.length) return this;
        if (n.isArray(h)) b = h; else if (n.isPlainObject(h)) for (rt in h) n.isArray(y = h[rt]) ? i.apply(b, n.map(y, function (n) {
            return { name: rt, value: n }
        })) : i.call(b, {
            name: rt,
            value: y
        }); else if ("string" == typeof h) for (h = h.split("&"), a = 0, tt = h.length; tt > a; a++) ot = h[a].split("="), i.call(b, {
            name: decodeURIComponent(ot[0].replace(r, "%20")),
            value: decodeURIComponent(ot[1].replace(r, "%20"))
        });
        if (!(tt = b.length)) return this;
        var p, l, ut, ct, k, d, g, y, w, v, st, nt, ft = n.noop, et = n.noop, ht = {};
        for (c = c || {}, it = f(it), n.isFunction(c) ? et = c : (ft = n.isFunction(c.change) ? c.change : ft, et = n.isFunction(c.complete) ? c.complete : et), a = 0; tt > a; a++) if (p = b[a], k = p.name, y = p.value, w = it[k], w && 0 !== w.length) if (ht[k] === t && (ht[k] = 0), st = ht[k]++ , w[st] && (l = w[st], g = (l.type || l.nodeName).toLowerCase(), s.test(g))) ft.call(l, l.value = y); else for (ut = 0, ct = w.length; ct > ut; ut++) if (l = w[ut], g = (l.type || l.nodeName).toLowerCase(), d = null, e.test(g) ? d = "checked" : o.test(g) && (d = "selected"), d) {
            if (nt = [], l.options) for (v = 0; v < l.options.length; v++) nt.push(l.options[v]); else nt.push(l);
            for (v = 0; v < nt.length; v++) p = nt[v], p.value == y && ft.call(p, (p[d] = !0) && y)
        }
        return et.call(this), this
    }
}(jQuery);
var docCookies = {
    getItem: function (n) {
        return n ? decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(n).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null : null
    }, setItem: function (n, t, i, r, u, f) {
        if (!n || /^(?:expires|max\-age|path|domain|secure)$/i.test(n)) return !1;
        var e = "";
        if (i) switch (i.constructor) {
            case Number:
                e = i === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + i;
                break;
            case String:
                e = "; expires=" + i;
                break;
            case Date:
                e = "; expires=" + i.toUTCString()
        }
        return document.cookie = encodeURIComponent(n) + "=" + encodeURIComponent(t) + e + (u ? "; domain=" + u : "") + (r ? "; path=" + r : "") + (f ? "; secure" : ""), !0
    }, removeItem: function (n, t, i) {
        return this.hasItem(n) ? (document.cookie = encodeURIComponent(n) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (i ? "; domain=" + i : "") + (t ? "; path=" + t : ""), !0) : !1
    }, hasItem: function (n) {
        return n ? new RegExp("(?:^|;\\s*)" + encodeURIComponent(n).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=").test(document.cookie) : !1
    }, keys: function () {
        for (var n = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/), i = n.length, t = 0; t < i; t++) n[t] = decodeURIComponent(n[t]);
        return n
    }
}, EventPublisher = function () {
    this.publishEvent = function (i, r, u, f) {
        n(i, r, u, f);
        t(i, r)
    };
    var n = function (n, t, i, r) {
        try {
            window.ga("send", "event", n, t, i, { nonInteraction: r || !1 })
        } catch (u) {
        }
    }, t = function (n, t) {
        window.__insp && window.__insp.push(["tagSession", n + ":" + t])
    }
}, $jscomp = {
    scope: {}, findInternal: function (n, t, i) {
        var f, r, u;
        for (n instanceof String && (n = String(n)), f = n.length, r = 0; r < f; r++) if (u = n[r], t.call(i, u, r, n)) return {
            i: r,
            v: u
        };
        return { i: -1, v: void 0 }
    }
};
$jscomp.defineProperty = "function" == typeof Object.defineProperties ? Object.defineProperty : function (n, t, i) {
    if (i.get || i.set) throw new TypeError("ES3 does not support getters and setters.");
    n != Array.prototype && n != Object.prototype && (n[t] = i.value)
};
$jscomp.getGlobal = function (n) {
    return "undefined" != typeof window && window === n ? n : "undefined" != typeof global && null != global ? global : n
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function (n, t, i, r) {
    if (t) {
        for (i = $jscomp.global, n = n.split("."), r = 0; r < n.length - 1; r++) {
            var u = n[r];
            u in i || (i[u] = {});
            i = i[u]
        }
        n = n[n.length - 1];
        r = i[n];
        t = t(r);
        t != r && null != t && $jscomp.defineProperty(i, n, { configurable: !0, writable: !0, value: t })
    }
};
$jscomp.polyfill("Array.prototype.find", function (n) {
    return n ? n : function (n, t) {
        return $jscomp.findInternal(this, n, t).v
    }
}, "es6-impl", "es3"), function (n, t, i) {
    "function" == typeof define && define.amd ? define(["jquery"], n) : "object" == typeof exports ? module.exports = n(require("jquery")) : n(t || i)
}(function (n) {
    var i = function (t, i, r) {
        var u = {
            invalid: [], getCaret: function () {
                try {
                    var n, i = 0, e = t.get(0), f = document.selection, r = e.selectionStart;
                    return f && -1 === navigator.appVersion.indexOf("MSIE 10") ? (n = f.createRange(), n.moveStart("character", -u.val().length), i = n.text.length) : (r || "0" === r) && (i = r), i
                } catch (o) {
                }
            }, setCaret: function (n) {
                try {
                    if (t.is(":focus")) {
                        var i, r = t.get(0);
                        r.setSelectionRange ? r.setSelectionRange(n, n) : (i = r.createTextRange(), i.collapse(!0), i.moveEnd("character", n), i.moveStart("character", n), i.select())
                    }
                } catch (u) {
                }
            }, events: function () {
                t.on("keydown.mask", function (n) {
                    t.data("mask-keycode", n.keyCode || n.which);
                    t.data("mask-previus-value", t.val())
                }).on(n.jMaskGlobals.useInput ? "input.mask" : "keyup.mask", u.behaviour).on("paste.mask drop.mask", function () {
                    setTimeout(function () {
                        t.keydown().keyup()
                    }, 100)
                }).on("change.mask", function () {
                    t.data("changed", !0)
                }).on("blur.mask", function () {
                    e === u.val() || t.data("changed") || t.trigger("change");
                    t.data("changed", !1)
                }).on("blur.mask", function () {
                    e = u.val()
                }).on("focus.mask", function (t) {
                    !0 === r.selectOnFocus && n(t.target).select()
                }).on("focusout.mask", function () {
                    r.clearIfNotMatch && !o.test(u.val()) && u.val("")
                })
            }, getRegexMask: function () {
                for (var n = [], t, e, o, r, u = 0; u < i.length; u++) (t = f.translation[i.charAt(u)]) ? (e = t.pattern.toString().replace(/.{1}$|^.{1}/g, ""), o = t.optional, (t = t.recursive) ? (n.push(i.charAt(u)), r = {
                    digit: i.charAt(u),
                    pattern: e
                }) : n.push(o || t ? e + "?" : e)) : n.push(i.charAt(u).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
                return n = n.join(""), r && (n = n.replace(new RegExp("(" + r.digit + "(.*" + r.digit + ")?)"), "($1)?").replace(new RegExp(r.digit, "g"), r.pattern)), new RegExp(n)
            }, destroyEvents: function () {
                t.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask "))
            }, val: function (n) {
                var i = t.is("input") ? "val" : "text";
                return 0 < arguments.length ? (t[i]() !== n && t[i](n), i = t) : i = t[i](), i
            }, calculateCaretPosition: function (n, i) {
                var u = i.length, r = t.data("mask-previus-value") || "", f = r.length;
                return 8 === t.data("mask-keycode") && r !== i ? n -= i.slice(0, n).length - r.slice(0, n).length : r !== i && (n = n >= f ? u : n + (i.slice(0, n).length - r.slice(0, n).length)), n
            }, behaviour: function (i) {
                var r, e;
                return i = i || window.event, u.invalid = [], r = t.data("mask-keycode"), -1 === n.inArray(r, f.byPassKeys) ? (r = u.getMasked(), e = u.getCaret(), setTimeout(function (n, t) {
                    u.setCaret(u.calculateCaretPosition(n, t))
                }, 10, e, r), u.val(r), u.setCaret(e), u.callbacks(i)) : void 0
            }, getMasked: function (n, t) {
                var c = [], l = void 0 === t ? u.val() : t + "", e = 0, y = i.length, s = 0, k = l.length, o = 1,
                    p = "push", w = -1, a, d, g;
                for (r.reverse ? (p = "unshift", o = -1, a = 0, e = y - 1, s = k - 1, d = function () {
                    return -1 < e && -1 < s
                }) : (a = y - 1, d = function () {
                    return e < y && s < k
                }); d();) {
                    var b = i.charAt(e), v = l.charAt(s), h = f.translation[b];
                    h ? (v.match(h.pattern) ? (c[p](v), h.recursive && (-1 === w ? w = e : e === a && (e = w - o), a === w && (e -= o)), e += o) : v === g ? g = void 0 : h.optional ? (e += o, s -= o) : h.fallback ? (c[p](h.fallback), e += o, s -= o) : u.invalid.push({
                        p: s,
                        v: v,
                        e: h.pattern
                    }), s += o) : (n || c[p](b), v === b ? s += o : g = b, e += o)
                }
                return l = i.charAt(a), y !== k + 1 || f.translation[l] || c.push(l), c.join("")
            }, callbacks: function (n) {
                var f = u.val(), h = f !== e, s = [f, n, t, r], o = function (n, t, i) {
                    "function" == typeof r[n] && t && r[n].apply(this, i)
                };
                o("onChange", !0 === h, s);
                o("onKeyPress", !0 === h, s);
                o("onComplete", f.length === i.length, s);
                o("onInvalid", 0 < u.invalid.length, [f, n, t, u.invalid, r])
            }
        }, f, e, o;
        t = n(t);
        f = this;
        e = u.val();
        i = "function" == typeof i ? i(u.val(), void 0, t, r) : i;
        f.mask = i;
        f.options = r;
        f.remove = function () {
            var n = u.getCaret();
            return u.destroyEvents(), u.val(f.getCleanVal()), u.setCaret(n), t
        };
        f.getCleanVal = function () {
            return u.getMasked(!0)
        };
        f.getMaskedVal = function (n) {
            return u.getMasked(!1, n)
        };
        f.init = function (e) {
            var s, h;
            if (e = e || !1, r = r || {}, f.clearIfNotMatch = n.jMaskGlobals.clearIfNotMatch, f.byPassKeys = n.jMaskGlobals.byPassKeys, f.translation = n.extend({}, n.jMaskGlobals.translation, r.translation), f = n.extend(!0, {}, f, r), o = u.getRegexMask(), e) u.events(), u.val(u.getMasked()); else {
                for (r.placeholder && t.attr("placeholder", r.placeholder), t.data("mask") && t.attr("autocomplete", "off"), e = 0, s = !0; e < i.length; e++) if (h = f.translation[i.charAt(e)], h && h.recursive) {
                    s = !1;
                    break
                }
                s && t.attr("maxlength", i.length);
                u.destroyEvents();
                u.events();
                e = u.getCaret();
                u.val(u.getMasked());
                u.setCaret(e)
            }
        };
        f.init(!t.is("input"))
    };
    n.maskWatchers = {};
    var u = function () {
        var t = n(this), u = {}, f = t.attr("data-mask");
        return t.attr("data-mask-reverse") && (u.reverse = !0), t.attr("data-mask-clearifnotmatch") && (u.clearIfNotMatch = !0), "true" === t.attr("data-mask-selectonfocus") && (u.selectOnFocus = !0), r(t, f, u) ? t.data("mask", new i(this, f, u)) : void 0
    }, r = function (t, i, r) {
        r = r || {};
        var u = n(t).data("mask"), f = JSON.stringify;
        t = n(t).val() || n(t).text();
        try {
            return "function" == typeof i && (i = i(t)), "object" != typeof u || f(u.options) !== f(r) || u.mask !== i
        } catch (e) {
        }
    }, t = function (n) {
        var i = document.createElement("div"), t;
        return n = "on" + n, t = n in i, t || (i.setAttribute(n, "return;"), t = "function" == typeof i[n]), t
    };
    n.fn.mask = function (t, u) {
        u = u || {};
        var f = this.selector, e = n.jMaskGlobals, s = e.watchInterval, e = u.watchInputs || e.watchInputs,
            o = function () {
                if (r(this, t, u)) return n(this).data("mask", new i(this, t, u))
            };
        return n(this).each(o), f && "" !== f && e && (clearInterval(n.maskWatchers[f]), n.maskWatchers[f] = setInterval(function () {
            n(document).find(f).each(o)
        }, s)), this
    };
    n.fn.masked = function (n) {
        return this.data("mask").getMaskedVal(n)
    };
    n.fn.unmask = function () {
        return clearInterval(n.maskWatchers[this.selector]), delete n.maskWatchers[this.selector], this.each(function () {
            var t = n(this).data("mask");
            t && t.remove().removeData("mask")
        })
    };
    n.fn.cleanVal = function () {
        return this.data("mask").getCleanVal()
    };
    n.applyDataMask = function (t) {
        t = t || n.jMaskGlobals.maskElements;
        (t instanceof n ? t : n(t)).filter(n.jMaskGlobals.dataMaskAttr).each(u)
    };
    t = {
        maskElements: "input,td,span,div",
        dataMaskAttr: "*[data-mask]",
        dataMask: !0,
        watchInterval: 300,
        watchInputs: !0,
        useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && t("input"),
        watchDataMask: !1,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            0: { pattern: /\d/ },
            9: { pattern: /\d/, optional: !0 },
            "#": { pattern: /\d/, recursive: !0 },
            A: { pattern: /[a-zA-Z0-9]/ },
            S: { pattern: /[a-zA-Z]/ }
        }
    };
    n.jMaskGlobals = n.jMaskGlobals || {};
    t = n.jMaskGlobals = n.extend(!0, {}, t, n.jMaskGlobals);
    t.dataMask && n.applyDataMask();
    setInterval(function () {
        n.jMaskGlobals.watchDataMask && n.applyDataMask()
    }, t.watchInterval)
}, window.jQuery, window.Zepto);
String.prototype.startsWith || (String.prototype.startsWith = function (n, t) {
    return t = t || 0, this.indexOf(n, t) === t
});
var employmentMonthsValidationLength = 12, addressHistoryMonthsValidationLength = 36, minApplicationAge = 18,
    employmentValidationMessage = "We require at least [employmentValidationMessageYearsLength] years worth of employment history. Please select your previous employment status.",
    getBenefitsBreakdown = !1, CustomValidation = function () {
        var t, i, r, n;
        this.formAreaIsValid = function (n) {
            return n.validator("validate"), !n.data("bs.validator").hasErrors() && !n.data("bs.validator").isIncomplete()
        };
        this.validateEmploymentStatusHistory = function () {
            var t, n = $("#employment-type").val();
            if (n === "Retired" || n === "Homemaker" || n === "Carer" || n === "Education" || n === "Benefits") {
                var r = $("#employment-type"), u = $("#employer").val("N/A"), f = $("#jobtitle").val("N/A"),
                    e = $("#employment-years").val((employmentMonthsValidationLength / 12).toFixed(0)),
                    o = $("#employment-months").val(employmentMonthsValidationLength % 12),
                    s = $(".js-employment-addresses-holder-display").first().find(".js-employment").length === 0 ? 0 : $(".js-employment-addresses-holder-display").first().find(".js-employment").length;
                var h = $("#employment-template").html(), c = Handlebars.compile(h), l = {
                    index: s,
                    employmentstatus: r.val(),
                    employer: u.val(),
                    jobtitle: f.val(),
                    years: e.val(),
                    months: o.val()
                }, a = c(l);
                $(".js-employment-inputs").append(a);
                $(".js-form-area").hide();
                $("#step9-monthly-income-form").show();
                var i = $(".form-progress"), v = parseInt(i.attr("data-step")), y = v + 3;
                getBenefitsBreakdown && n === "Benefits" ? (getBenefitsBreakdownStep($("#step9-monthly-income-form")), updateFormStepLabel("next", 2)) : updateFormStepLabel("next", 3);
                i.attr("data-step", y)
            } else t = !0;
            return t
        };
        this.validateAddressHistory = function () {
            var n = 0, t = addressHistoryMonthsValidationLength;
            return $("input[name$=TimeAtAddressYears]").each(function () {
                var t = parseInt(this.value) * 12;
                n += isNaN(t) ? 0 : t
            }), $("input[name$=TimeAtAddressMonths]").each(function () {
                var t = parseInt(this.value);
                n += isNaN(t) ? 0 : t
            }), Math.floor(n / t) >= 1
        };
        this.validEmployerHistory = function () {
            var i = 0, r = employmentMonthsValidationLength, n, t;
            return $("input[name$=TimeAtEmployerYears]").each(function () {
                var n = parseInt(this.value) * 12;
                i += isNaN(n) ? 0 : n
            }), $("input[name$=TimeAtEmployerMonths]").each(function () {
                var n = parseInt(this.value);
                i += isNaN(n) ? 0 : n
            }), n = Math.floor(i / r) >= 1, n && (t = 0, $(document).find(".js-employment-inputs input[name$=TimeAtEmployerYears]").each(function () {
                var n = parseInt(this.value) * 12;
                t += isNaN(n) ? 0 : n
            }), $(document).find(".js-employment-inputs input[name$=TimeAtEmployerMonths]").each(function () {
                var n = parseInt(this.value);
                t += isNaN(n) ? 0 : n
            }), n = Math.floor(t / r) >= 1), n
        };
        this.validDateOfBirth = function () {
            var i, h = $(".date").val(), e = h.split("/"), r = e[0], u = e[1], n = e[2], t, s;
            if (n.length == 2) {
                var o = Math.ceil((new Date).getFullYear() / 100) * 100 - 100,
                    c = parseInt((new Date).getFullYear().toString().substr(2, 3)), f = [r, u, n];
                parseInt(n) > c ? (o -= 100, n = o + parseInt(n), f[2] = n, $(".date").val(f.join("/"))) : (n = o + parseInt(n), f[2] = n, $(".date").val(f.join("/")))
            }
            if (n > 1900 && n < 2100 && r >= 1 && r <= 31 && u >= 1 && u <= 12) {
                if (t = new Date, t.setFullYear(n, u - 1, r), s = typeof maxApplicationAge != "undefined" ? maxApplicationAge : 99, t.getFullYear() != n || t.getMonth() != u - 1 || t.getDate() != r) return i = !1, $(".dob-helpblock").text("Please use a valid date"), i;
                if (getAge(t) >= minApplicationAge && getAge(t) <= s) {
                    i = !0;
                    var l = $("#dob-template").html(), a = Handlebars.compile(l), v = { dobday: r, dobmonth: u, dobyear: n },
                        y = a(v);
                    $(".js-dob-inputs").append(y)
                } else i = !1, typeof maxApplicationAge == "undefined" ? $(".dob-helpblock").text("you must be " + minApplicationAge + " or over to be eligible") : $(".dob-helpblock").text("you must be aged between " + minApplicationAge + " and " + s + " to be eligible")
            } else i = !1, $(".dob-helpblock").text("invalid date");
            return i
        };
        this.validEmail = function () {
            return $(".js-email-form-group").hasClass("has-custom-success") ? !0 : $(".js-email-form-group").hasClass("has-custom-error") ? !1 : this.validEmailService()
        };
        this.validEmailService = function () {
            var e = $('input[name="email"]'), n = e.val(), f = new EventPublisher, r = ".js-email-form-group .help-block",
                u = ".js-email-form-group";
            t(u, "has-custom-warning");
            i(r, 'Checking email... <i class="fa fa-refresh fa-spin" aria-hidden="true"><\/i>');
            $.ajax({
                url: "/emailvalidation/validate?email=" + n + "&source=" + $('input[name="Referrer"]').val(),
                type: "GET",
                success: function (e) {
                    return e.IsValid ? (t(u, "has-custom-success"), i(r, 'Valid email <i class="fa fa-check" style="color:green;" aria-hidden="true"><\/i>'), f.publishEvent("email-validation", "email-valid", n), !0) : (t(u, "has-custom-error"), i(r, 'Email could not be validated <i class="fa fa-times" style="color:red;" aria-hidden="true"><\/i>'), f.publishEvent("email-validation", "email-invalid", n), !1)
                },
                error: function () {
                    return t(u, "has-custom-success"), i(r, 'Valid email <i class="fa fa-check" style="color:green;" aria-hidden="true"><\/i>'), f.publishEvent("email-validation", "service-error", n), !0
                },
                timeout: 5e3
            })
        };
        this.validMobile = function () {
            return $(".js-mobile-form-group").hasClass("has-custom-success") ? !0 : $(".js-mobile-form-group").hasClass("has-custom-error") ? !1 : this.validMobileService()
        };
        this.validMobileService = function () {
            var e = $('input[name="mobile"]'), n = e.val();
            n.indexOf("+44") > -1 && (n = n.replace("+44", "0"), e.val(n));
            n.startsWith("44") && (n = "0" + n.substr(2), e.val(n));
            var f = new EventPublisher, r = ".js-mobile-form-group .help-block", u = ".js-mobile-form-group";
            if (t(u, "has-custom-warning"), i(r, 'Checking mobile... <i class="fa fa-refresh fa-spin" aria-hidden="true"><\/i>'), new RegExp(/^07[123456789]\d{8}$/).test(n)) $.ajax({
                url: "/mobilevalidation/validate?mobile=" + n + "&source=" + $('input[name="Referrer"]').val(),
                type: "GET",
                success: function (e) {
                    return e.IsValid ? (t(u, "has-custom-success"), i(r, 'Valid mobile <i class="fa fa-check" style="color:green;" aria-hidden="true"><\/i>'), f.publishEvent("mobile-validation", "mobile-valid", n), !0) : (t(u, "has-custom-error"), i(r, 'Invalid mobile <i class="fa fa-times" style="color:red;" aria-hidden="true"><\/i>'), f.publishEvent("mobile-validation", "mobile-invalid", n), !1)
                },
                error: function () {
                    return t(u, "has-custom-success"), i(r, 'Valid mobile <i class="fa fa-check" style="color:green;" aria-hidden="true"><\/i>'), f.publishEvent("mobile-validation", "service-error", n), !0
                },
                timeout: 5e3
            }); else return t(u, "has-custom-error"), i(r, 'Invalid mobile <i class="fa fa-times" style="color:red;" aria-hidden="true"><\/i>'), f.publishEvent("mobile-validation", "mobile-validation-failed", n), !1
        };
        t = function (n, t) {
            $(n).removeClass("has-custom-success").removeClass("has-custom-error").removeClass("has-custom-warning").addClass(t)
        };
        i = function (n, t) {
            $(n).html('<ul class="list-unstyled"><li>' + t + "<\/li><\/ul>")
        };
        $('input[name="email"]').off("blur").on("blur", function () {
            var n = $(this);
            window.__insp && window.__insp.push(["tagSession", { email: n.val() }])
        });
        this.formStepsValidation = function (t, i) {
            var p, ut, st, u, ct, tt, it, rr, ur, vi, pi, at, cr, lr, ar, y, yt, pt, rt;
            (typeof i == "undefined" || i == null) && (i = !0);
            var bu = new EventPublisher, vr = t.data("validate-age"), yr = t.data("validate-address"),
                pr = t.data("add-manual-address-active"), wr = t.data("add-manual-employment-active"),
                br = t.data("validate-employment"), kr = t.data("validate-mobile"), dr = t.data("validate-email"),
                gr = t.data("add-address"), nu = t.data("check-addresses"), tu = t.data("add-employment"),
                iu = t.data("validate-employment-status"), ru = t.data("check-residential-status-required"),
                ku = t.data("check-employment-status-required"), uu = t.data("check-income"),
                fu = t.data("joint-app-income"), eu = t.data("check-license"), ou = t.data("joint-app-license"),
                gi = t.data("test-date"), su = t.data("check-additional-employment-history"),
                f = t.closest(".js-form-area");
            if (this.formAreaIsValid(f)) {
                if (pr) {
                    u = $(".js-addresses-holder-display").first().find(".js-address").length === 0 ? 0 : $(".js-addresses-holder-display").first().find(".js-address").length;
                    var wt = $("#address-status"), bt = $("#address-building"), s = $("#address-buildingNumber"),
                        h = $("#address-buildingName"), kt = $("#address-subBuildingName"), dt = $("#address-country"),
                        gt = $("#address-countryCode"), ni = $("#address-organisationName"), ti = $("#address-street"),
                        ii = $("#address-county"), ri = $("#address-town"), ui = $("#address-postcode"),
                        ft = $(document).find('.postcode-years-months-row [id*="address-years"]'),
                        et = $(document).find('.postcode-years-months-row [id*="address-months"]');
                    if (s.val().length == 0 && h.val().length == 0) return s.parents(".form-group").addClass("has-error"), h.parents(".form-group").addClass("has-error"), s.siblings("span").text("Please enter one of the above"), h.siblings("span").text("Please enter one of the above"), !1;
                    s.parent("form-group").removeClass("has-error");
                    h.parent("form-group").removeClass("has-error");
                    s.siblings("span").text("");
                    h.siblings("span").text("");
                    var ot = $("#address-display-template").html(), fi = Handlebars.compile(ot),
                        ei = $("#addresses-template").html(), oi = Handlebars.compile(ei), e = {
                            index: u,
                            residentialstatus: wt.val(),
                            building: bt.val(),
                            buildingNumber: s.val(),
                            buildingName: h.val(),
                            subBuildingName: kt.val(),
                            organisationName: ni.val(),
                            country: dt.val(),
                            countryCode: gt.val(),
                            street: ti.val(),
                            town: ri.val(),
                            county: ii.val(),
                            postcode: ui.val(),
                            years: ft.val() || ft.attr("value") || "",
                            months: et.val() || et.attr("value") || ""
                        }, st = fi(e);
                    $(".js-addresses-holder-display").append(st);
                    p = oi(e);
                    $(".js-address-inputs").append(p);
                    $(".js-addresses-container-display").show();
                    $("#step10-postcode-entry-form .js-btn-next").removeAttr("data-add-manual-address-active").removeData("add-manual-address-active")
                }
                if (wr) {
                    console.log("addEmploymentFromManual");
                    u = $(".js-employment-addresses-holder-display").first().find(".js-employment").length === 0 ? 0 : $(".js-employment-addresses-holder-display").first().find(".js-employment").length;
                    var wt = $("#employment-address-status"), bt = $("#employment-address-building"),
                        s = $("#employment-address-buildingNumber"), h = $("#employment-address-buildingName"),
                        kt = $("#employment-address-subBuildingName"), dt = $("#employment-address-country"),
                        gt = $("#employment-address-countryCode"), ni = $("#employment-address-organisationName"),
                        ti = $("#employment-address-street"), ii = $("#employment-address-county"),
                        ri = $("#employment-address-town"), ui = $("#employment-address-postcode"),
                        ft = $(document).find('.employment-postcode-years-months-row [id*="address-years"]'),
                        et = $(document).find('.employment-postcode-years-months-row [id*="address-months"]');
                    if (s.val().length == 0 && h.val().length == 0) return s.parents(".form-group").addClass("has-error"), h.parents(".form-group").addClass("has-error"), s.siblings("span").text("Please enter one of the above"), h.siblings("span").text("Please enter one of the above"), !1;
                    s.parent("form-group").removeClass("has-error");
                    h.parent("form-group").removeClass("has-error");
                    s.siblings("span").text("");
                    h.siblings("span").text("");
                    var ot = $("#employment-display-template").html(), fi = Handlebars.compile(ot),
                        ei = $("#employment-template").html(), oi = Handlebars.compile(ei), e = {
                            index: u,
                            residentialstatus: wt.val(),
                            building: bt.val(),
                            buildingNumber: s.val(),
                            buildingName: h.val(),
                            subBuildingName: kt.val(),
                            organisationName: ni.val(),
                            country: dt.val(),
                            countryCode: gt.val(),
                            street: ti.val(),
                            town: ri.val(),
                            county: ii.val(),
                            postcode: ui.val(),
                            years: ft.val() || ft.attr("value") || "",
                            months: et.val() || et.attr("value") || ""
                        }, st = fi(e);
                    $(".js-employment-addresses-holder-display").append(st);
                    p = oi(e);
                    $(".js-employment-address-inputs").append(p);
                    $(".js-employment-addresses-container-display").show();
                    $("#step10-employment-postcode-entry-form .js-btn-next").removeAttr("data-add-manual-employment-active").removeData("add-manual-employment-active");
                    $("#additional-employment-postcode-entry-form .js-btn-next").removeAttr("data-add-employment").removeData("add-employment");
                    $("#additional-employment-postcode-entry-form .js-btn-next").removeAttr("data-add-manual-employment-active").removeData("add-manual-employment-active")
                }
                if (gr) {
                    u = $(".js-addresses-holder-display").first().find(".js-address").length === 0 ? 0 : $(".js-addresses-holder-display").first().find(".js-address").length - 1;
                    var ot = $("#addresses-template").html(), fi = Handlebars.compile(ot), wt = $("#address-status"),
                        bt = $("#address-building"), h = $("#address-buildingName"), s = $("#address-buildingNumber"),
                        kt = $("#address-subBuildingName"), ni = $("#address-organisationName"), dt = $("#address-country"),
                        gt = $("#address-countryCode"), ti = $("#address-street"), ii = $("#address-county"),
                        ri = $("#address-town"), ui = $("#address-postcode"), nr = $("#address-years"),
                        si = $("#address-months"), ht;
                    ht = si.val() == "" ? 0 : si.val();
                    $('input[name="Addresses[' + u + '].ResidentialStatus"]').val(wt.val());
                    $('input[name="Addresses[' + u + '].TimeAtAddressYears"]').val(nr.val());
                    $('input[name="Addresses[' + u + '].TimeAtAddressMonths"]').val(ht);
                    bt.val("");
                    h.val("");
                    s.val("");
                    kt.val("");
                    ni.val("");
                    dt.val("");
                    gt.val("");
                    ti.val("");
                    ii.val("");
                    ri.val("");
                    ui.val("");
                    nr.val("");
                    si.val("")
                }
                if (tu) {
                    u = $(".js-employment-addresses-holder-display").first().find(".js-employment").length === 0 ? 0 : $(".js-employment-addresses-holder-display").first().find(".js-employment").length;
                    t.data("check-additional-employment-history") && (u = parseInt($("#additional-employment-postcode-entry-form").attr("data-additional-employment-index")));
                    $("body").hasClass("bprop-form") && (u = $(".js-employment-addresses-holder-display").first().find(".js-employment").length === 0 ? 0 : $(".js-employment-addresses-holder-display").first().find(".js-employment").length);
                    var tr = $("#employment-type"), hi = $("#employer"), ci = $("#jobtitle"),
                        ir = $("#employment-address-building").length > 0 ? $("#employment-address-building") : !1,
                        c = $("#employment-address-buildingName").length > 0 ? $("#employment-address-buildingName") : !1,
                        l = $("#employment-address-buildingNumber").length > 0 ? $("#employment-address-buildingNumber") : !1,
                        a = $("#employment-address-subBuildingName").length > 0 ? $("#employment-address-subBuildingName") : !1,
                        w = $("#employment-address-organisationName").length > 0 ? $("#employment-address-organisationName") : !1,
                        b = $("#employment-address-country").length > 0 ? $("#employment-address-country") : !1,
                        k = $("#employment-address-countryCode").length > 0 ? $("#employment-address-countryCode") : !1,
                        d = $("#employment-address-street").length > 0 ? $("#employment-address-street") : !1,
                        g = $("#employment-address-town").length > 0 ? $("#employment-address-town") : !1,
                        nt = $("#employment-address-county").length > 0 ? $("#employment-address-county") : !1,
                        v = $("#employment-address-postcode").length > 0 ? $("#employment-address-postcode") : !1,
                        li = $("#employment-years"), ai = $("#employment-months"), ht = ai.val() == "" ? 0 : ai.val();
                    var ei = $("#employment-display-template").html(), hu = $("#employment-display-only-template").html(),
                        cu = Handlebars.compile(hu), oi = Handlebars.compile(ei), o = {
                            index: u,
                            employmentstatus: tr.val(),
                            employer: hi.val(),
                            jobtitle: ci.val(),
                            years: li.val(),
                            months: ht
                        };
                    t.data("check-additional-employment-history") && (o = {
                        index: u,
                        employmentstatus: $('[name="Employment[' + u + '].Employer"]').val(),
                        employer: $('[name="Employment[' + u + '].Employer"]').val(),
                        jobtitle: $('[name="Employment[' + u + '].JobTitle"]').val(),
                        years: $('[name="Employment[' + u + '].TimeAtEmployerYears"]').val(),
                        months: $('[name="Employment[' + u + '].TimeAtEmployerMonths"]').val()
                    });
                    v && (o.postcode = v.val());
                    (a || c) && l && (o.building = (a.val() ? a.val() + " " : "") + (c.val() ? c.val() + " " : "") + (l.val() ? l.val() : ""));
                    d && (o.street = d.val());
                    g && (o.town = g.val());
                    nt && (o.county = nt.val());
                    v && (o.postcode = v.val());
                    l && (o.buildingNumber = l.val());
                    c && (o.buildingName = c.val());
                    a && (o.subBuildingName = a.val());
                    w && (o.organisationName = w.val());
                    b && (o.country = b.val());
                    k && (o.countryCode = k.val());
                    p = oi(o);
                    ut = cu(o);
                    $("body").hasClass("bprop-form") || $(".js-employment-addresses-holder-display").first().append(p);
                    $(".js-employment-addresses-holder-display").each(function () {
                        $(this).children().length <= u && ($("body").hasClass("bprop-form") || $(this).append(ut))
                    });
                    $("body").hasClass("bprop-form") && ($(".js-employment-addresses-holder-display").children().length == 0 ? $(".js-employment-addresses-holder-display").append(ut) : $(".js-employment-addresses-holder-display").children().eq($(".js-employment-addresses-holder-display").children().length - 1).text() != $.parseHTML(ut)[1].textContent && $(".js-employment-addresses-holder-display").append(ut));
                    $(".js-employment-addresses-container-display").show();
                    var ot = $("#employment-template").html(), fi = Handlebars.compile(ot), e = {
                        index: u,
                        employmentstatus: tr.val(),
                        employer: hi.val(),
                        jobtitle: ci.val(),
                        years: li.val(),
                        months: ht
                    };
                    $("body").hasClass("bprop-form") && $(".js-employment-addresses-holder-display").children().length >= 0 && (e.index = $(".js-employment-addresses-holder-display").children().length - 1);
                    t.data("check-additional-employment-history") && (e = {
                        index: u,
                        employmentstatus: $('.js-additional-employment-data-section [name="Employment[' + u + '].EmploymentStatus"]').val(),
                        employer: $('.js-additional-employment-data-section [name="Employment[' + u + '].Employer"]').val(),
                        jobtitle: $('.js-additional-employment-data-section [name="Employment[' + u + '].JobTitle"]').val(),
                        years: $('.js-additional-employment-data-section [name="Employment[' + u + '].TimeAtEmployerYears"]').val(),
                        months: $('.js-additional-employment-data-section [name="Employment[' + u + '].TimeAtEmployerMonths"]').val()
                    });
                    (a || c) && l && (e.building = (a.val() ? a.val() + " " : "") + (c.val() ? c.val() + " " : "") + (l.val() ? l.val() : ""));
                    d && (e.street = d.val());
                    g && (e.town = g.val());
                    nt && (e.county = nt.val());
                    v && (e.postcode = v.val());
                    l && (e.buildingNumber = l.val());
                    c && (e.buildingName = c.val());
                    a && (e.subBuildingName = a.val());
                    w && (e.organisationName = w.val());
                    b && (e.country = b.val());
                    k && (e.countryCode = k.val());
                    v && (e.postcode = v.val());
                    st = fi(e);
                    $(".js-employment-inputs").append(st);
                    hi.val("");
                    ci.val("");
                    li.val("");
                    ai.val("");
                    ir && ir.val("");
                    d && d.val("");
                    g && g.val("");
                    nt && nt.val("");
                    v && v.val("");
                    l && l.val("");
                    c && c.val("");
                    a && a.val("");
                    w && w.val("");
                    b && b.val("");
                    k && k.val("");
                    v && v.val("")
                }
                if (su) {
                    for (u = $(".js-employment-addresses-holder-display").first().find(".js-employment").length === 0 ? 0 : $(".js-employment-addresses-holder-display").first().find(".js-employment").length, ct = 0, tt = 0, it = 0; it < u; it++) rr = parseInt($('.js-additional-employment-data-section [name="Employment[' + it + '].TimeAtEmployerYears"]').val() * 12), ur = parseInt($('.js-additional-employment-data-section [name="Employment[' + it + '].TimeAtEmployerMonths"]').val()), ct = ct + (rr + ur), tt = it + 1;
                    ct < employmentMonthsValidationLength && ($("#additional-employment-postcode-entry-form").attr("data-additional-employment-index", u), setTimeout(function () {
                        $(".postcode-entry").show();
                        $(".postcode-entry").parents(".js-form-area").next().hide();
                        $(".postcode-entry .form-group").removeClass("has-error");
                        $(".postcode-entry .form-group input").val("");
                        $(".postcode-entry span.with-errors").empty();
                        $(".js-addresses-container-display").hide();
                        $(".postcode-lookup-list").hide();
                        $(".manual-address").hide();
                        $(".manual-address-only").show();
                        $("#additional-employment-postcode-entry-form h2 span").first().text("the");
                        $("#additional-employment-postcode-entry-form h2 span").last().text("when you worked at " + $('[name="Employment[' + tt + '].Employer"]').val() + " as " + $('[name="Employment[' + tt + '].JobTitle"]').val() + " for " + parseInt($('[name="Employment[' + tt + '].TimeAtEmployerYears"]').val()) + " Years and " + parseInt($('[name="Employment[' + tt + '].TimeAtEmployerMonths"]').val()) + " months");
                        $("#additional-employment-postcode-entry-form").show();
                        $(document).find('.js-btn-next[data-add-employment="true"]').removeAttr("data-add-employment").removeData("add-employment").removeAttr("data-add-manual-employment-active").removeData("add-manual-employment-active");
                        $(".address-list").empty();
                        $(".address-list").append('<option value="">Please select...<\/option>');
                        updateFormStepLabel("next", -1)
                    }, 1))
                }
                if (nu && $(".js-address").length === 1 && (vi = parseInt($('input[name="Addresses[0].TimeAtAddressYears"]').val()) * 12 + parseInt($('input[name="Addresses[0].TimeAtAddressMonths"]').val()), vi < 36 && ($('input[name="Addresses[0].TimeAtAddressYears"]').val("3"), $('input[name="Addresses[0].TimeAtAddressMonths"]').val("0"))), eu) {
                    var yi = $('input[name="DrivingLicenseType"]').val(), fr = $("#applicant-license"),
                        er = $("#step-confirm-license"), lu = $("#step-driving-test-date"),
                        lt = $('input[name="ConfirmLicense"]'), pi = $("#step3-marital-status-form");
                    yi === "International" ? (n($(".progress-container")), fr.text("an International driving licence"), f.hide(), er.show(), lt.val("true")) : yi === "None" ? (n($(".progress-container")), fr.text("no driving licence"), f.hide(), lt.val("true"), er.show()) : yi === "Provisional UK" ? (n($(".progress-container")), f.hide(), lu.show()) : (n($(".progress-container")), f.hide(), pi.show())
                } else if (gi) {
                    pi = $("#step3-marital-status-form");
                    at = new Date;
                    at.setHours(0, 0, 0, 0);
                    var au = $("#driving-test-date").val(), wi = au.split("/"), bi = wi[0], ki = wi[1], di = wi[2],
                        gi = new Date(di, ki - 1, bi);
                    di >= at.getFullYear() && di < 2100 && bi >= 1 && bi <= 31 && ki >= 1 && ki <= 12 ? gi >= at ? (f.hide(), pi.show()) : $(".test-helpblock").text("Test date must be after todays date") : $(".test-helpblock").text("invalid date")
                } else if (ou) {
                    var lt = $('input[name="ConfirmLicense"]').val(), or = $("#step-joint-app-license"),
                        vu = $("#step4-driving-license-form"), yu = $('input[name="JointApplicationLicense"]');
                    lt === "true" ? (n($(".progress-container")), f.hide(), or.show(), yu.val("true")) : lt === "false" && (n($(".progress-container")), f.hide(), vu.show())
                } else if (uu) {
                    var pu = $('input[name="EmploymentType"]').val(), sr = parseInt($('input[name="MonthlyIncome"]').val()),
                        vt = $('input[name="ConfirmIncome"]');
                    pu == "Full-Time Employment" && sr <= 700 ? (n($(".progress-container")), $("#applicant-income").text(sr), f.hide(), $("#step-confirm-full-time-income").show(), vt.val("true")) : (n($(".progress-container")), f.hide(), $("#step10-postcode-entry-form").show())
                } else if (fu) {
                    var vt = $('input[name="ConfirmIncome"]'), hr = $('input[name="JointApplicationIncome"]'),
                        or = $("#step-joint-app-income"), wu = $("#step9-monthly-income-form");
                    vt.val() === "true" ? (n($(".progress-container")), f.hide(), or.show(), hr.val("true")) : vt.val() === "false" && (n($(".progress-container")), f.hide(), wu.show(), vt.val("false"), hr.val("false"))
                } else {
                    if (vr && !this.validDateOfBirth() || iu && !this.validateEmploymentStatusHistory()) return rt = f.find(".has-error, .has-custom-error")[0], n($(rt)), !1;
                    if (yr && !this.validateAddressHistory()) {
                        var y = $(".form-progress"), yt = parseInt(y.attr("data-step")), pt = yt - 1;
                        return y.attr("data-step", pt), i && updateFormStepLabel("next", -1), f.hide(), $(".postcode-lookup-list, .manual-address").hide(), $(".manual-address-only").show(), $("#step10-postcode-entry-form").show(), $(".postcode-entry").show(), updateFormStepLabel("next", -2), $("#step10-postcode-entry-form h2").text("You've lived here for less than " + (addressHistoryMonthsValidationLength / 12).toFixed(0) + " years, could you provide a previous address?").css({ color: "#ff0000" }), $("#step12-address-years-form .js-tense").text($("#step12-address-years-form .js-tense").data("past-tense")), vi == 0 && $("#step12-address-years-form .js-tense").text($("#step12-address-years-form .js-tense").data("present-tense")), !1
                    }
                    if (br && !this.validEmployerHistory()) {
                        var y = $(".form-progress"), yt = parseInt(y.attr("data-step")), pt = yt - 2;
                        return y.attr("data-step", pt), i && updateFormStepLabel("next", -3), f.hide(), $(".postcode-lookup-list, .manual-address").hide(), $(".manual-address-only").show(), $(".postcode-entry").show(), $("#step6-employment-status-form").show(), $("body").hasClass("bprop-form") && $("#step10-employment-postcode-entry-form").show(), cr = (employmentMonthsValidationLength / 12).toFixed(0), lr = employmentValidationMessage.replace("[employmentValidationMessageYearsLength]", cr), $(".js-employment-addresses-container-display").show(), $("#step6-employment-status-form h2").text(lr).css({ color: "#ff0000" }), !1
                    }
                    return kr && !this.validMobile() || dr && !this.validEmail() ? (rt = f.find(".has-error, .has-custom-error")[0], n($(rt)), !1) : (ar = r(f.next(".js-form-area")), ru && $(".js-address").length > 1, y = $(".form-progress"), yt = parseInt(y.attr("data-step")), f.hide(), ar.show(), pt = yt + 1, y.attr("data-step", pt), i && updateFormStepLabel("next"), n($(".progress-container")), $(".js-form-area").removeClass("js-is-not-valid"), $(".js-form-area").addClass("js-is-valid"), !0)
                }
            } else return rt = f.find(".has-error, .has-custom-error")[0], n($(rt)), $(".js-form-area").removeClass("js-is-valid"), $(".js-form-area").addClass("js-is-not-valid"), !1
        };
        r = function (n) {
            var t = n;
            return t.hasClass("skipped-area") ? r(t.next(".js-form-area")) : t
        };
        n = function (n) {
            if (typeof n.offset() != "undefined") {
                var t = n.offset();
                $("html, body").animate({ scrollTop: t.top }, 100)
            }
        }
    };
$(document).ready(function () {
    var u, r, f, n, e, t, o, i;
    $(document).trigger({ type: "newFormPage" });
    $('input[name="mobile"]').off("blur").on("blur", function () {
        (new CustomValidation).validMobileService()
    });
    $(document).on("blur", 'input[name="email"]', () => {
        typeof validateEmail != "undefined" && validateEmail == "true" && (new CustomValidation).validEmailService()
    });
    $(".js-btn-next").on("click", function (n) {
        n.preventDefault();
        (new CustomValidation).formStepsValidation($(this), null, n);
        var t = new EventPublisher, i = $(this).parents(".js-form-area").attr("id");
        t.publishEvent("Breadcrumb-Form", "" + i + "-completed")
    });
    u = function (n) {
        var t = n;
        return t.hasClass("skipped-area") ? u(t.prev(".js-form-area")) : t
    };
    $(".js-btn-previous").on("click", function (n) {
        var t;
        n.preventDefault();
        var i = $(this).closest(".js-form-area"), e = u(i.prev(".js-form-area")), f = $(".form-progress"),
            o = parseInt(f.attr("data-step"));
        i.hide();
        e.show();
        t = o - 1;
        f.attr("data-step", t);
        updateFormStepLabel("prev");
        r($(".finance-facts"));
        t === 1 && $(".website-stat-holder").show();
        setHeightIframe();
        setTimeout(function () {
            setHeightIframe()
        }, 50)
    });
    $(".get-started-btn").on("click", function () {
        r($(".form-container"))
    });
    $(".button-list").on("click", function () {
        var n = $(this), t = $(this).parents(".form-group"), i = t.find("input.button-list-value");
        t.find(".button-list").removeAttr("data-selected");
        n.attr("data-selected", "");
        i.val(n.data("type"))
    });
    $(".other-reveal").on("click", function () {
        var i = $(this), t = $(this).parents(".other-reveal-holder"), n = $(this).parents(".js-form-area");
        n.find(".hidden-options").show();
        n.find(".form-continue").hide();
        r($(".hidden-options"));
        t.hide()
    });
    r = function (n) {
        if (typeof n.offset() != "undefined") {
            var t = n.offset();
            $("html, body").animate({ scrollTop: 300 }, 500)
        }
    };
    $(".monthly-button").on("click", function () {
        var n = $(this), t = $(this).parents(".form-group"), i = t.find('input[name="MonthlyMin"]'),
            r = t.find('input[name="MonthlyMax"]');
        t.find(".button-list").removeAttr("data-selected");
        n.attr("data-selected", "");
        i.val(n.data("loan-min"));
        r.val(n.data("loan-max"))
    });
    setLoanAmount = function () {
        var t = +$('input[name="MonthlyMin"]').val() || 0, i = +$('input[name="MonthlyMax"]').val() || 0,
            r = +$("#MonthlyIncome").val() || 0, n = calculateLoan(r, t, i);
        n !== 0 && $('input[name="AmountToBorrow"]').val(n)
    };
    calculateLoan = function (n, t, i) {
        var r = 0;
        return r = Math.min(Math.max(t + (n - 1e3), t), i), Math.floor(r / 100) * 100
    };
    $(".monthly-button").on("click", function () {
        setLoanAmount()
    });
    $("#MonthlyIncome").on("input", function () {
        setLoanAmount()
    });
    f = $("#employment-years");
    n = $("#employment-months");
    $(f).on("keyup change input blur", function () {
        f.val() < "1" ? (n.prop("required", !0), n.attr("min", "1")) : (n.prop("required", !1), n.attr("min", "0"))
    });
    e = $("#address-years");
    t = $("#address-months");
    $(e).on("keyup change input blur", function () {
        e.val() < "1" ? (t.prop("required", !0), t.attr("min", "1")) : (t.prop("required", !1), t.attr("min", "0"))
    });
    o = $("#bank-years");
    i = $("#bank-months");
    $(o).on("keyup change input blur", function () {
        o.val() < "1" ? (i.prop("required", !0), i.attr("min", "1")) : (i.prop("required", !1), i.attr("min", "0"))
    })
});
stepsVisible = 0;
updateFormStepLabel = function (n, t) {
    var u = $(document).find(".progress-line"), f = $(document).find("form .js-form-area.skipped-area").length,
        e = $(document).find("form .js-form-area").length - 1 - f, r, i = "";
    n == "next" ? stepsVisible++ : stepsVisible--;
    typeof t != "undefined" && (stepsVisible += t);
    r = 100 / e * stepsVisible;
    r > 100 && (r = 100);
    i = "1";
    r > 33.3 && (i = "2");
    r > 66.6 && (i = "3");
    r >= 100 && (u.width("100%"), i = "4");
    u.width(r.toFixed(2) + "%");
    i === "1" ? ($(".progress-bullet").removeClass("active"), $(".progress-bullet-1 .progress-bullet").addClass("active")) : i === "2" ? ($(".progress-bullet").removeClass("active"), $(".progress-bullet-1 .progress-bullet, .progress-bullet-2 .progress-bullet").addClass("active")) : i === "3" ? ($(".progress-bullet").removeClass("active"), $(".progress-bullet-1 .progress-bullet, .progress-bullet-2 .progress-bullet,  .progress-bullet-3 .progress-bullet").addClass("active")) : i === "4" && ($(".progress-bullet").removeClass("active"), $(".progress-bullet").addClass("active"))
};
$(".date").mask("99/99/9999", { placeholder: "DD / MM / YYYY" });
$("#sortcode").mask("99-99-99", { placeholder: "12 - 34 - 56" });
$(window).width() < 415 && $(".button-list").click(function () {
    var n = $(this).parents(".js-form-area"), t = n.height(), i = t * .6;
    return $("html, body").animate({ scrollTop: i }, 500), !1
});
$(".edit-employment").off("click");
$(document).on("click", ".edit-employment", function () {
    var n = $(this).data("index"), i = $("#manual-employer"), r = $("#manual-jobtitle"),
        u = $("#manual-employment-years"), f = $("#manual-employment-months"), e;
    i.val("");
    r.val("");
    u.val("");
    f.val("");
    var t = $(".js-employment-inputs"), o = t.children('input[name="Employment[' + n + '].Employer"]').val(),
        s = t.children('input[name="Employment[' + n + '].JobTitle"]').val(),
        h = t.children('input[name="Employment[' + n + '].TimeAtEmployerYears"]').val(),
        c = t.children('input[name="Employment[' + n + '].TimeAtEmployerMonths"]').val();
    i.val(o);
    r.val(s);
    u.val(h);
    f.val(c);
    $(".employment-status-select").hide();
    $(".manual-employment").show();
    $("#step6-employment-status-form").find(".js-btn-next").attr("disabled", !0);
    e = $(".update-employment-row");
    e.find(".update-current-employment-btn").attr("data-index", n)
});
$(".update-current-employment-btn").off("click");
$(".update-current-employment-btn").on("click", function () {
    var n = $(this).data("index"), i = $("#manual-employer"), r = $("#manual-jobtitle"),
        u = $("#manual-employment-years"), f = $("#manual-employment-months"), t;
    $(".js-employment-" + n + " span").html(i.val() + ", " + r.val() + ", " + u.val() + " Years, " + f.val() + " Months");
    t = $(".js-employment-inputs");
    t.children('input[name="Employment[' + n + '].Employer"]').val(i.val());
    t.children('input[name="Employment[' + n + '].JobTitle"]').val(r.val());
    t.children('input[name="Employment[' + n + '].TimeAtEmployerYears"]').val(u.val());
    t.children('input[name="Employment[' + n + '].TimeAtEmployerMonths"]').val(f.val());
    $(".js-employment-addresses-holder-display .js-employment").length === 2 ? $(".employment-status-select").hide() : $(".employment-status-select").show();
    $(".manual-employment").hide();
    $("#step6-employment-status-form").find(".js-btn-next").attr("disabled", !1);
    $(this).removeData("index")
});
$(document).ready(function () {
    $(".postcode-lookup").off("click").on("click", function (n) {
        n.preventDefault();
        var i = this, t = $(i).closest(".postcode-entry").find(".js-postcode");
        t.val(t.val().replace(/ /g, "").toUpperCase());
        performPostcodeLookup(i, t)
    })
});
$(".btn-cancel-address").click(function () {
    $(".manual-address").hide();
    $(".manual-address-only").show();
    $("#step10-postcode-entry-form").find(".js-btn-next").attr("disabled", !1);
    var n = $(".js-address-inputs"), t = $(".js-address"),
        i = n.children('input[name="Addresses[0].TimeAtAddressYears"]'),
        r = n.children('input[name="Addresses[0].TimeAtAddressMonths"]'),
        u = n.children('input[name="Addresses[1].TimeAtAddressYears"]'),
        f = n.children('input[name="Addresses[1].TimeAtAddressMonths"]');
    t.length === 1 && i.val().length === 0 && r.val().length === 0 ? $(".postcode-entry").hide() : t.length === 1 && i.val() != null && r.val() != null ? $(".postcode-entry").show() : t.length === 2 && u.val().length === 0 && f.val().length === 0 ? $(".postcode-entry").hide() : $(".postcode-entry").hide();
    $(".postcode-years-months-row").hide();
    $(".update-address-row").hide()
});
$(".btn-cancel-employment").click(function () {
    $(".manual-employment").hide();
    $(".employment-status-select").show();
    $("#step6-employment-status-form").find(".js-btn-next").attr("disabled", !1)
});
querystring = window.location.search.substring(1);
$(document).ready(function () {
    $('input[type="number"]').on("blur", function () {
        $(this).attr("min") >= 0 && $(this).val(Math.abs($(this).val()))
    });
    querystring.length > 0 && hideInputsFromQuerystring(querystring)
});
getBenefitsBreakdownStep = function (n) {
    var t = '<div class="js-form-area" style="display: none;" id="step-benefit-breakdown-form">"';
    t += '   <h1 class="text-center">Benefits<\/h1>';
    t += '   <h2 class="text-center">Your benefits breakdown<\/h2>';
    t += '   <div class="row" > ';
    t += '       <div class="center-block col-md-6">';
    t += '           <div class="form-group">';
    t += "               <div>";
    t += '                   <label for="benefits_1" class= "form-label">Child Allowance<\/label>';
    t += '                   <input type="text" class="form-control form-control-small" id="benefits_1" name="benefits_1" required="" placeholder="Child Allowance">';
    t += '                   <span class="help-block with-errors" ><\/span>';
    t += "               <\/div>";
    t += "           <\/div>";
    t += '           <div class="form-group">';
    t += "               <div>";
    t += '                   <label for="benefits_2" class= "form-label">Housing Allowance<\/label>';
    t += '                   <input type="text" class="form-control form-control-small" id="benefits_2" name="benefits_2" required="" placeholder="Housing Allowance">';
    t += '                   <span class="help-block with-errors" ><\/span>';
    t += "               <\/div>";
    t += "          <\/div>";
    t += '          <div class="form-group">';
    t += "              <div>";
    t += '                  <label for="benefits_3" class= "form-label">Weekly Allowance<\/label>';
    t += '                  <input type="text" class="form-control form-control-small" id="benefits_3" name="benefits_3" required="" placeholder="Weekly Allowance">';
    t += '                  <span class="help-block with-errors" ><\/span>';
    t += "              <\/div>";
    t += "          <\/div>";
    t += "      <\/div>";
    t += "   <\/div>";
    t += '   <div class="row">';
    t += '      <div class="col-sm-offset-4 col-sm-4">';
    t += '          <a href="#" class="btn btn-block btn-next btn-default js-btn-next">Next Step<\/a>';
    t += "      <\/div>";
    t += "   <\/div>";
    t += "<\/div>";
    n.after(t)
};
makeDoubleDigit = function (n) {
    return parseInt(n) < 10 && parseInt(n) > 0 && n.length == 1 ? 0 + n : n
};
$(document).ready(function () {
    if ($(".js-dob-seperated").length > 0) {
        $(".js-dob-seperated .input-wrap input").on("focus", function () {
            $(this).prev().length > 0 && $(this).prev().val() === "" && $(this).prev().focus()
        });
        $(".js-dob-seperated .input-wrap input").on("input", function () {
            $(this).val().length > 0 ? $(this).addClass("completed") : $(this).removeClass("completed");
            ($(this).hasClass("js-dob-day") || $(this).hasClass("js-dob-month")) && $(this).val().length === 2 && $(this).next().focus();
            $("#Dob").val(makeDoubleDigit($(".js-dob-day").val()) + "/" + makeDoubleDigit($(".js-dob-month").val()) + "/" + $(".js-dob-year").val())
        });
        setTimeout(function () {
            $(".js-dob-seperated input").trigger("input")
        }, 500)
    }
    $(".js-btn-next").on("click", function () {
        typeof deadApp != "undefined" && $(this).parents(".js-form-area").find("input").each(function () {
            var n = $(this).attr("name"), t = $(this).val().toLowerCase();
            typeof deadApp.rules[n] == "object" && $.each(deadApp.rules[n], function (n, i) {
                if (i.toLowerCase() == t) if (deadApp.redirect.length > 0) {
                    $(".js-form-area").addClass("hidden");
                    var r = JSON.stringify({ from: getIframeName(), redirect: deadApp.redirect });
                    sendMessage(r)
                } else $(".js-form-area").addClass("hidden"), $(".form-progress").hide(), document.getElementById("car-finance-form").reset(), $(".sorry-area").show()
            })
        })
    });
    $(".dob-buttons").length > 0 && dobButtonsFunc();
    ($("input[name='VehicleSelection']").length > 0 || $(".js-vehicle-type-selector").length > 0) && $(".vehicle-buttons-holder .image-included.btn-circle").click(function () {
        var n = $(this).parents("form").find('input[name="vehicle-type"]').val();
        $('input[name="VehicleSelection"]').val(n)
    })
});
dobButtonsFunc = function () {
    function t(n) {
        return n < 10 ? "0" + n.toString() : n.toString()
    }

    function r(n) {
        $(".bod-month-of-year .button-list").each(function () {
            var t = $(this).data("type");
            n > i[t - 1] ? $(this).addClass("disable") : $(this).removeClass("disable")
        })
    }

    function u(n) {
        return new Date(n, 1, 29).getDate() === 29
    }

    function n(n) {
        n ? $(".bod-year .button-list").each(function () {
            var n = $(this).data("type");
            $(this).addClass("disable");
            u(n) && $(this).removeClass("disable")
        }) : $(".bod-year .button-list").each(function () {
            $(this).removeClass("disable")
        })
    }

    var i = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    $(document).find(".bod-month-of-year .button-list.disable ").click(!1);
    $(document).find(".bod-year .button-list.disable").click(!1);
    $("#step2-dob-form .button-list").off("click").on("click", function () {
        var u = $(this).data("type"), i = $(this).data("date-of-birth");
        $(this).parents(".calander-wrap").find("[data-selected]").removeAttr("data-selected");
        $('.date-of-birth [data-date-of-birth="' + i + '"] span').text(t(u, 2)).addClass("active");
        i == "day" && (r(u), $(".bod-day-of-month, .bod-year").hide(), $(".bod-month-of-year").show());
        i == "month" && ($(".bod-month-of-year, .bod-day-of-month").hide(), $(".bod-year").show());
        i == "year" && $(this).attr("data-selected", "");
        $("#Dob").val($('.date-of-birth [data-date-of-birth="day"]').text() + "/" + $('.date-of-birth [data-date-of-birth="month"]').text() + "/" + $('.date-of-birth [data-date-of-birth="year"]').text());
        $("#Dob").val().indexOf("_") > 0 ? $(".dob-next").attr("disabled", "disabled") : $(".dob-next").attr("disabled", !1);
        setTimeout(function () {
            $(".bod-month-of-year [data-selected]").data("type") == 2 && $(".bod-day-of-month [data-selected]").data("type") == 29 ? n(!0) : n(!1)
        }, 50)
    });
    $("#step2-dob-form .date-of-birth button").on("click", function () {
        var n = $(this).data("date-of-birth");
        n == "day" && ($(".bod-month-of-year, .bod-year").hide(), $(".bod-day-of-month").show());
        n == "month" && ($(".bod-day-of-month, .bod-year").hide(), $(".bod-month-of-year").show());
        n == "year" && ($(".bod-month-of-year, .bod-day-of-month").hide(), $(".bod-year").show())
    });
    $("#step2-dob-form .year-groupings button").on("click", function () {
        $(this).text() == "back" ? ($(this).parents(".bod-year").find(".year-container").show().find(".year-ranges").hide(), $(this).text($(this).data("text-replace"))) : ($(this).parents(".bod-year").find(".year-container").hide(), $(this).parents(".year-container").show().find(".year-ranges").show(), $(this).text("back"))
    })
};
$(document).ready(function () {
    var r = parseInt($('input[name="AmountToBorrow"]').val()),
        i = [3e3, 3500, 4e3, 4500, 5e3, 6e3, 7e3, 8e3, 9e3, 1e4, 12e3, 14e3, 16e3, 18e3, 2e4, 25e3, 3e4, 35e3, 4e4, 45e3, 5e4],
        t = function (n) {
            for (var r, u = i[0], f = 0, t = 0; t < i.length; t++) r = i[t], Math.abs(n - r) < Math.abs(n - u) && (u = r, f = t);
            return f
        }, n;
    $("#loan-amount-slider").slider({
        value: isNaN(r) ? t(4e3) : t(r),
        min: 0,
        max: i.length - 1,
        step: 1,
        range: "min",
        slide: function (t, r) {
            n(i[r.value])
        }
    });
    $(".js-loan-amount-label").on("focus", function () {
        var i = $(this), r = parseInt($('input[name="AmountToBorrow"]').val());
        i.val("");
        i.off("blur").on("blur", function () {
            var i = parseInt($(this).val().replace("£", ""));
            isNaN(i) || i < 3e3 || i > 5e4 ? (i < 3e3 && (n(3e3), $("#loan-amount-slider").slider("value", t(3e3))), i > 5e4 && (n(5e4), $("#loan-amount-slider").slider("value", t(5e4)))) : ($("#loan-amount-slider").slider("value", t(i)), n(i))
        })
    });
    $(".js-btn-loan-decrease").on("click", function () {
        var i = parseInt($('input[name="AmountToBorrow"]').val()) - 500;
        i >= 3e3 && (n(i), $("#loan-amount-slider").slider("value", t(i)))
    });
    $(".js-btn-loan-increase").on("click", function () {
        var i = parseInt($('input[name="AmountToBorrow"]').val()) + 500;
        i <= 5e4 && (n(i), $("#loan-amount-slider").slider("value", t(i)))
    });
    $('input[name="AmountToBorrow"]').on("change", function () {
        n(this.value)
    });
    n = function (n) {
        $('input[name="AmountToBorrow"]').val(n);
        $(".js-loan-amount-label").val("£" + n)
    }
});
vehicleTypeAPIChoices = ["Car", "Van", "Motorbike", "Caravan", "MotorHome", "Motorhome", "HGV", "Static Caravan", "Other"];
$(document).ready(function () {
    $(".btn-circle").on("click", function () {
        var t = $(this), n = t.data("vehicle-type");
        $(".btn-circle").removeAttr("data-selected");
        t.attr("data-selected", "");
        vehicleTypeAPIChoices.indexOf(n) > -1 ? ($('input[name="VehicleType"]').val(n), $('input[name="OtherVehicleType"]').val("")) : ($('input[name="OtherVehicleType"]').length == 0 && $('input[name="VehicleType"]').after('<input type="hidden" name="OtherVehicleType" value="">'), $('input[name="VehicleType"]').val("Other"), $('input[name="OtherVehicleType"]').val(n))
    })
});
$(document).ready(function () {
    $(".js-helper-text-btn").on("click", function (n) {
        n.preventDefault();
        $(".js-helper-text").text($(this).data("helper-text"));
        $(".js-helper-title").text($(this).data("helper-title"));
        $("#helper-text-modal").modal()
    })
});
$(document).ready(function () {
    $('input[name="AgreeToEmailMarketing"]').on("change", function () {
        $(".js-email-optin").prop("checked", this.checked)
    });
    $('input[name="AgreeToSmsMarketing"]').on("change", function () {
        $(".js-sms-optin").prop("checked", this.checked)
    });
    $(".js-email-selectall").on("change", function () {
        $(".js-email-optin").prop("checked", this.checked)
    });
    $(".js-sms-selectall").on("change", function () {
        $(".js-sms-optin").prop("checked", this.checked)
    });
    $(".js-show-companies").on("click", function (n) {
        n.preventDefault();
        var t = $(this), i = t.closest(".js-product-row");
        t.text() === "[Show]" ? t.text("[Hide]") : t.text("[Show]");
        i.find(".js-companies").toggle()
    })
});
$(document).ready(function () {
    var n = function () {
        var n = $("#car-finance-form").serialize();
        docCookies.setItem("form_data", n, Infinity)
    }, t = function () {
        var n = docCookies.getItem("form_data");
        n !== null && $("#car-finance-form").deserialize(n, {
            change: function () {
                var n = this;
                n.name === "HasDepositCheck" && $(n).trigger("change");
                n.name === "AmountToBorrow" && $(".js-loan-amount-label").val("£" + $(n).val());
                n.name === "mobile" && n.value.length > 0 && $(n).trigger("blur");
                $(this).parent().attr("name") === "Employment[0].EmploymentStatus" && $(this).parent().trigger("change")
            }
        })
    };
    $("input").on("keyup", n);
    $("select").on("change", n);
    $('input[type="checkbox"]').on("change", n);
    $(".js-btn-next").on("click", n);
    t()
});
$(document).ready(function () {
    function t(n) {
        for (var o = n.split("&"), f = 0; f < o.length; f++) {
            var s = o[f].split("="), t = decodeURIComponent(s[0].toLowerCase()), e = decodeURIComponent(s[1]),
                u = $('input[name="' + t + '"], select[name="' + t + '"]');
            if (u.length == 0 && (u = $('input[id="' + t + '"], select[id="' + t + '"]')), u.length > 0 && (!i(t) || r(t, e)) && (u.val(e).trigger("change"), $.Topic !== undefined && $.Topic("form-area-changed").publish("#" + u.closest(".collapsible").attr("id"))), t == "accustomformtype") {
                var h = $('input[name="referrer"]').val(), c = "-" + e, l = h + c;
                $('input[name="referrer"]').val(l)
            }
        }
    }

    function i(n) {
        return $('select[name="' + n + '"]').length > 0
    }

    function r(n, t) {
        var i = !1;
        return $('select[name="' + n.toLowerCase() + '"] option').each(function () {
            this.value == t && (i = !0)
        }), i
    }

    $(document).find("[name]").each(function () {
        var n = $(this).attr("name");
        $(this).attr("original-name", n);
        $(this).attr("name", n.toLowerCase())
    });
    $(document).on("change", 'input[type="hidden"]', function () {
        var t = $(this).val(), n;
        t.length > 0 && (n = $(this).parents(".js-form-area"), n.find('[data-type="' + t + '"]').trigger("click"), n.find('[data-vehicle-type="' + t + '"]').trigger("click"), (n.find('[data-type="' + t + '"]').length > 0 || n.find('[data-vehicle-type="' + t + '"]').length > 0) && n.find("[data-selected]").removeAttr("data-selected"), n.find('[data-type="' + t + '"]').attr("data-selected", ""), n.find('[data-vehicle-type="' + t + '"]').attr("data-selected", ""))
    });
    var n = window.location.search.substring(1);
    n.length > 0 && t(n);
    $(document).find("[name]").each(function () {
        var n = $(this).attr("original-name");
        $(this).attr("name", n)
    })
});
