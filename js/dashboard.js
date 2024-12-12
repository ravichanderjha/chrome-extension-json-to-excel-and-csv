function capitalizeFirstLetter(a) {
    return a.charAt(0).toUpperCase() + a.slice(1)
}
var table = newTabulator("#example-table", {
    layout: "fitData",
    placeholder: "Loading",
    selectable: 1
});
document.getElementById("download-csv").addEventListener("click", function() {
    rolecheck().then(function(a) {
        const b = a.quota || 0;
        var c = a.used || 0;
        c > b ? (table.download("csv", "results.csv"),
        console.log("download 1 emails."),
        updateuse(1),
        c += 1,
        document.getElementById("accountinfo").innerHTML = `Current Plan: ${a.plan}, Quota: ${b}, Used: ${c}`) : (alert("Download Quota Used UP, Please Upgrade your plan."),
        upgradeToPro())
    }).catch(a => {
        console.log(a)
    }
    )
});
document.getElementById("download-xlsx").addEventListener("click", function() {
    table.download("xlsx", "results.xlsx", {
        sheetName: "My Data"
    });
    console.log("download 1 emails.");
});
function flattenObject(a, b="") {
    if (a) {
        if ("object" !== typeof a)
            return a;
        var c = {};
        for (const [d,e] of Object.entries(a))
            a = b ? `${b}_${d}` : d,
            "object" === typeof e && null !== e ? Object.assign(c, flattenObject(e, a)) : c[a] = e;
        return c
    }
}
function generateColumns(a) {
    const b = new Set([]);
    var c = [];
    b.forEach(d => {
        c.push({
            title: capitalizeFirstLetter(d),
            field: d,
            width: 300,
            resizable: !0
        })
    }
    );
    Array.from(a).sort().forEach(d => {
        b.has(d) || c.push({
            title: capitalizeFirstLetter(d),
            field: d,
            width: 300,
            resizable: !0
        })
    }
    );
    table.setColumns(c)
}
function showData() {
    chrome.storage.local.get(null, function(a) {
        a = a.leads || [];
        for (var b = new Set, c = [], d = 0; d < a.length; ++d) {
            const e = flattenObject(a[d]);
            c.push(e);
            Object.keys(e).forEach(g => b.add(g))
        }
        generateColumns(b);
        table.setData(c)
    })
}
function normalizeProfileId(a) {
    return a.replace("@", "").trim().toLowerCase()
}
$(document).ready(function() {
    chrome.storage.sync.get(null, function(a) {
        a.uid && rolecheck().then(function(b) {
            document.getElementById("accountinfo").innerHTML = `Current Plan: ${b.plan}, Quota: ${b.quota}, Used: ${b.used}`
        })
    })
});
//get event from background.js
chrome.runtime.onMessage.addListener(function(a, b, c) {
    "getExcel" === a.action && (console.log("getExcel"),
    console.log(a),
    c({
        data: "data"
    }))
});
function d(h, f) {
    if (f && "string" !== typeof f)
        if (Array.isArray(f))
            0 < f.length && (all_lists[h || "/"] = f,
            d(`${h}/0`, f[0]));
        else if ("object" === typeof f)
            for (const k in f)
                d(`${h}/${k}`, f[k])
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //log received data
    if (request.action == "getExcel") {
        console.log("getExcel");
        console.log(request);
        //send data to dashboard.js
        var e = request.data[0].result;
        console.log(e);
        d("", e);
        0 == all_lists.length && (all_lists["/"] = [e]);
        console.log("all lists: ", all_lists);
        e = document.getElementById("lists");
        for (var g in all_lists) {
            const h = document.createElement("option");
            h.value = g;
            h.text = g;
            e.appendChild(h)
        }
        e.selectedIndex = 0;
        g = new Event("change");
        e.dispatchEvent(g)
        
        sendResponse({ data: "data" });
    }
}   
    );

let all_lists = {};
document.getElementById("file-input").addEventListener("change", a => {
    let b = document.getElementById("lists");
    for (; 0 < b.options.length; )
        b.remove(0);
    all_lists = {};
    a = a.target.files[0];
    console.log(a);
    const c = new FileReader;
    c.onload = () => {
        function d(h, f) {
            if (f && "string" !== typeof f)
                if (Array.isArray(f))
                    0 < f.length && (all_lists[h || "/"] = f,
                    d(`${h}/0`, f[0]));
                else if ("object" === typeof f)
                    for (const k in f)
                        d(`${h}/${k}`, f[k])
        }
        var e = JSON.parse(c.result);
        console.log(e);
        d("", e);
        0 == all_lists.length && (all_lists["/"] = [e]);
        console.log("all lists: ", all_lists);
        e = document.getElementById("lists");
        for (var g in all_lists) {
            const h = document.createElement("option");
            h.value = g;
            h.text = g;
            e.appendChild(h)
        }
        e.selectedIndex = 0;
        g = new Event("change");
        e.dispatchEvent(g)
    }
    ;
    c.readAsText(a)
}
);
document.getElementById("lists").addEventListener("change", function() {
    var a = document.getElementById("lists")
      , b = a.options[a.selectedIndex].value;
    console.log("Selected option:", b);
    var c = new Set;
    a = [];
    b = all_lists[b];
    console.log("datas: ", b);
    for (var d = 0; d < b.length; ++d)
        if (b[d])
            if ("object" === typeof b[d]) {
                const e = flattenObject(b[d]);
                e && (a.push(e),
                console.log(e),
                Object.keys(e).forEach(g => c.add(g)))
            } else
                c.add("Title"),
                a.push({
                    Title: b[d]
                });
    generateColumns(c);
    table.setData(a)
});
