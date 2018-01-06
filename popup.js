
function toggle(obj) {

  if (obj.style.display == "block") {

    obj.style.display = "none";
    obj.style.height = "0px";

  } else {

    obj.style.display = "block";
    obj.style.height = "auto";
    document.getElementById("attribtext").focus();
    document.getElementById("attribtext").select();
    document.execCommand('copy');

  }

}

chrome.extension.onMessage.addListener(

  function (request, sender, sendResponse) {


  }

);


function init() {

  chrome.extension.sendMessage({ wanting: "tab_id" }, function (data) {

    populate_window();

  });

}

function populate_window() {

  var bkg = chrome.extension.getBackgroundPage();

  obj = bkg.active_data;

  if (bkg.active_data["title"] != undefined) {
    title = bkg.active_data["title"].split("\"").join(" ").split("<").join(" ").split("javascript").join("");
  }

  if (bkg.active_data["url"] != undefined) {
    url = bkg.active_data["url"].split("\"").join(" ").split("<").join(" ").split("javascript").join("");
  }

  if (bkg.active_data["license"] != undefined) {
    license = bkg.active_data["license"].split("\"").join(" ").split("<").join(" ").split("javascript").join("");
  } else {
    license = "";
  }

  if (bkg.active_data["license_link"] != undefined) {
    license_link = bkg.active_data["license_link"].split("\"").join(" ").split("<").join(" ").split("javascript").join("");
  } else {
    license_link = "";
  }

  if (bkg.active_data["license_shorthand"] != undefined) {
    license_shorthand = bkg.active_data["license_shorthand"].split("\"").join(" ").split("<").join(" ").split("javascript").join("");
  } else {
    license_shorthand = "";
  }

  if (bkg.active_data["author"] != undefined) {
    author = bkg.active_data["author"].split("\"").join(" ").split("<").join(" ").split("javascript").join("");
  } else {
    author = "";
  }

  if (author.length == 0) {

    if (bkg.active_data["attributionName"] != undefined) {

      author = bkg.active_data["attributionName"];

    }

  }

  attribution_url = bkg.active_data["attributionURL"];

  non_html_attrib_string = "";

  parent_node = document.getElementById("attrib_iframe").contentDocument;

  var page_title = document.createElement("P");
  page_title.style.fontWeight = "bold";

  newtext = document.createTextNode("Title : " + title);

  page_title.appendChild(newtext);
  parent_node.body.appendChild(page_title);

  attrib_string = '<a href="' + url + '"><span property="dct:title">' + title + '</span></a>';
  attrib_string_light = title;

  non_html_attrib_string = "[" + title + "](" + url + ")";

  var page_url = document.createElement("P");
  newtext = document.createTextNode("Source : " + url);
  page_url.appendChild(newtext);
  parent_node.body.appendChild(page_url);

  var page_license = document.createElement("P");
  var page_license_text_holder = document.createElement("SPAN");
  page_license_text_holder.innerText = "license : ";
  page_license.appendChild(page_license_text_holder);
  parent_node.body.appendChild(page_license);

  var page_license_text_holder_link = document.createElement("A");
  page_license_text_holder_link.href = license_link;
  page_license_text_holder_link.innerText = license;
  page_license.appendChild(page_license_text_holder_link);
  parent_node.body.appendChild(page_license);

  if (author != "") {
    var page_attrib = document.createElement("P");
    var page_attrib_text_holder = document.createElement("SPAN");
    page_attrib_text_holder.innerText = "Author : ";
    page_attrib.appendChild(page_attrib_text_holder);
    parent_node.body.appendChild(page_attrib);

    var page_attrib_text_holder_link = document.createElement("A");
    page_attrib_text_holder_link.href = attribution_url;
    page_attrib_text_holder_link.innerText = author;
    page_attrib.appendChild(page_attrib_text_holder_link);
    parent_node.body.appendChild(page_license);

    if (attribution_url != "") {
      attrib_string += ' by <a rel="cc:attributionName" ' + 'href="' + attribution_url + '" >' + author + '</a>';
    } else {
      attrib_string += ' by <a rel="cc:attributionName">' + author + '</a>';
    }
    attrib_string_light += " by " + author;

  }

  attrib_string_light += ", " + url;

  function more_open() {

    if (document.getElementById("attrib_iframe").contentWindow.document.getElementById('extra').style.display == 'block') {
      document.getElementById("attrib_iframe").contentWindow.document.getElementById('extra').style.display = 'none'
    } else {
      document.getElementById("attrib_iframe").contentWindow.document.getElementById('extra').style.display = 'block'
    }

  }

  var page_reveal_segment = document.createElement("FORM");
  var page_reveal_segment_button = document.createElement("INPUT");
  page_reveal_segment_button.setAttribute("type", "button");
  page_reveal_segment_button.setAttribute("value", "More Information");
  page_reveal_segment.appendChild(page_reveal_segment_button);
  parent_node.body.appendChild(page_reveal_segment);
  page_reveal_segment_button.addEventListener("click", more_open);


  if (license_shorthand.indexOf("  ") != -1) {

    l_s = license_shorthand.split("  ").join(" ");

  } else {

    l_s = license_shorthand;

  }

  l_s = l_s.split(" ");

  cc_l_s = l_s[2];

  l_s = l_s.join(" ");

  attrib_string += ' (<a rel="license" href="' + license_link + '">' + l_s + '</a>)';
  attrib_string = "<div xmlns:dc=\"http://purl.org/dc/terms/\" xmlns:cc\"http://creativecommons.org/#ns\" about=\"" + url + "\">" + attrib_string + "</div>";
  attrib_string_light += " /" + l_s;

  non_html_attrib_string += license.split("\n").join("") + " / " + l_s + "\n";

  license_color = "";

  if (cc_l_s != undefined) {

    switch (cc_l_s.toLowerCase()) {
      case "by":
      case "by-sa":
      case "mark":
      case "zero":
      case "publicdomain":
        license_color = "green";
        break;

      case "by-nc":
      case "by-nd":
      case "by-nc-nd":
      case "by-nc-sa":
      case "sampling+":
      case "nc-sampling+":
        license_color = "yellow";
        break;

      case "sampling":
      case "devnations":
        license_color = "red";
        break;
    }

  }

  var extra_holder = document.createElement("DIV");
  extra_holder.style.display = "none";
  extra_holder.id = "extra";
  parent_node.body.appendChild(extra_holder);

  if (license_color != "") {

    var page_license_colour = document.createElement("P");
    page_license_colour.style.width = "80%";
    page_license_colour.style.height = "30px";
    page_license_colour.style.backgroundColor = license_color;
    extra_holder.appendChild(page_license_colour);

  }

  var basic_attribution = document.createElement("P");
  newtext = document.createTextNode("Basic Attribution");
  basic_attribution.appendChild(newtext);
  extra_holder.appendChild(basic_attribution);

  if (attrib_string_light != undefined) {

    var basic_attribution_text = document.createElement("TEXTAREA");
    basic_attribution_text.setAttribute("rows", "7");
    basic_attribution_text.setAttribute("cols", "60");
    basic_attribution_text.innerText = attrib_string_light;
    extra_holder.appendChild(basic_attribution_text);

  }

  var rdfa_attribution = document.createElement("P");
  newtext = document.createTextNode("RDFa Attribution");
  rdfa_attribution.appendChild(newtext);
  extra_holder.appendChild(rdfa_attribution);

  if (attrib_string != undefined) {

    var rdfa_attribution_text = document.createElement("TEXTAREA");
    rdfa_attribution_text.setAttribute("rows", "7");
    rdfa_attribution_text.setAttribute("cols", "60");
    rdfa_attribution_text.innerText = attrib_string;
    extra_holder.appendChild(rdfa_attribution_text);

  }

  function all_open() {

    if (document.getElementById("attrib_iframe").contentWindow.document.getElementById('all_data').style.display == 'block') {
      document.getElementById("attrib_iframe").contentWindow.document.getElementById('all_data').style.display = 'none'
    } else {
      document.getElementById("attrib_iframe").contentWindow.document.getElementById('all_data').style.display = 'block'
    }

  }

  var all_reveal_segment = document.createElement("FORM");
  var all_reveal_segment_button = document.createElement("INPUT");
  all_reveal_segment_button.setAttribute("type", "button");
  all_reveal_segment_button.setAttribute("value", "All Data");
  all_reveal_segment.appendChild(all_reveal_segment_button);
  parent_node.body.appendChild(all_reveal_segment);
  all_reveal_segment_button.addEventListener("click", all_open);

  var all_holder = document.createElement("DIV");
  all_holder.style.display = "none";
  all_holder.id = "all_data";
  parent_node.body.appendChild(all_holder);

  var all_text_title = document.createElement("P");
  all_text = document.createTextNode("All Data");
  all_text_title.appendChild(all_text);
  all_holder.appendChild(all_text_title);

  var csv_title = document.createElement("P");
  csv_text = document.createTextNode("URL,LICENSE,NAME,ATTRIBUTION_URL,AUTHOR");
  csv_title.appendChild(csv_text);
  all_holder.appendChild(csv_title);



  url_data = bkg.url_cache;

  for (x in url_data) {

    if (url_data[x]['license'] != "") {

      var data_text = document.createElement("P");

      string = x + "," + url_data[x]['license'] + "," + url_data[x]['license'] + "," + url_data[x]["attributionName"] + "," + url_data[x]["attributionURL"] + url_data[x]["author"];

      url_text = document.createTextNode(string);
      data_text.appendChild(url_text);
      all_holder.appendChild(data_text);

    }

  }

}

window.addEventListener("load", init);
