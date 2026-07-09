(() => {
  "use strict";

  const canvas = document.getElementById("previewCanvas");
  const ctx = canvas.getContext("2d");

  const orderForm = document.getElementById("orderForm");

  const MAX_TOTAL_UPLOAD = 9 * 1024 * 1024;

  const state = {
    photoCount: 1,

    photos: [
      null,
      null,
      null,
      null
    ],

    photoFiles: [
      null,
      null,
      null,
      null
    ],

    textMode: "typed",

    text: "",

    handwriting: null,

    handwritingFile: null,

    key1Mode: "photo",

    key2Mode: "photo",

    key1Photo: null,

    key2Photo: null,

    key1File: null,

    key2File: null,

    key1Text: "",

    key2Text: "",

    nfcMode: "simple",

    nfcFile: null
  };


  const SHARE_URL =
    "https://carbridgefr-glitch.github.io/test-profil-page/premium-nfc-gift.html";

  const SHARE_TITLE =
    "Φτιάξε τη δική σου Premium Δημιουργία";

  const SHARE_TEXT =
    "Πρόσθεσε φωτογραφίες, κείμενο, δύο μπρελόκ και NFC και δες τη δημιουργία σου ζωντανά.";


  const panels = {
    photos:
      document.getElementById("panel-photos"),

    text:
      document.getElementById("panel-text"),

    keychains:
      document.getElementById("panel-keychains"),

    nfc:
      document.getElementById("panel-nfc")
  };


  const photoInputs =
    document.getElementById("photoInputs");

  const photoCountLabel =
    document.getElementById("photoCountLabel");

  const frameText =
    document.getElementById("frameText");

  const handwritingFile =
    document.getElementById("handwritingFile");

  const key1Mode =
    document.getElementById("key1Mode");

  const key2Mode =
    document.getElementById("key2Mode");

  const key1Photo =
    document.getElementById("key1Photo");

  const key2Photo =
    document.getElementById("key2Photo");

  const key1Text =
    document.getElementById("key1Text");

  const key2Text =
    document.getElementById("key2Text");

  const nfcFile =
    document.getElementById("nfcFile");

  const missingModal =
    document.getElementById("missingModal");

  const missingText =
    document.getElementById("missingText");

  const previewModal =
    document.getElementById("previewModal");

  const finalPreviewImage =
    document.getElementById("finalPreviewImage");

  const infoModal =
    document.getElementById("infoModal");

  const infoTitle =
    document.getElementById("infoTitle");

  const infoImage =
    document.getElementById("infoImage");

  const infoText =
    document.getElementById("infoText");


  /*
  ΣΗΜΑΝΤΙΚΟ:

  Τα uploads βρίσκονται έξω από τη φόρμα.

  Με αυτόν τον τρόπο τα συνδέουμε με το
  orderForm ώστε να σταλούν μαζί στο email.
  */

  [
    handwritingFile,
    key1Photo,
    key2Photo,
    nfcFile
  ].forEach(input => {

    if (input) {
      input.setAttribute(
        "form",
        "orderForm"
      );
    }

  });


  /*
  ΑΛΛΑΓΗ ΠΑΝΕΛ
  */

  function showPanel(name) {

    Object.entries(panels).forEach(
      ([key, panel]) => {

        panel.classList.toggle(
          "active",
          key === name
        );

      }
    );


    document
      .querySelectorAll(
        ".tool-tabs button"
      )
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.panel === name
        );

      });


    panels[name].scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  }


  document
    .querySelectorAll("[data-panel]")
    .forEach(element => {

      element.addEventListener(
        "click",
        () => {

          showPanel(
            element.dataset.panel
          );

        }
      );

    });


  /*
  ΦΟΡΤΩΣΗ ΕΙΚΟΝΑΣ
  */

  function loadImage(
    file,
    callback
  ) {

    if (!file) {

      callback(null);

      return;

    }


    const url =
      URL.createObjectURL(file);


    const image =
      new Image();


    image.onload = () => {

      URL.revokeObjectURL(url);

      callback(image);

    };


    image.onerror = () => {

      URL.revokeObjectURL(url);

      callback(null);

    };


    image.src = url;

  }


  /*
  ΣΧΕΔΙΑΣΗ ΕΙΚΟΝΑΣ
  */

  function drawCover(
    image,
    x,
    y,
    width,
    height
  ) {

    if (!image) {
      return;
    }


    const imageRatio =
      image.width /
      image.height;


    const boxRatio =
      width /
      height;


    let sourceX = 0;

    let sourceY = 0;

    let sourceWidth =
      image.width;

    let sourceHeight =
      image.height;


    if (
      imageRatio >
      boxRatio
    ) {

      sourceWidth =
        image.height *
        boxRatio;

      sourceX =
        (
          image.width -
          sourceWidth
        ) / 2;

    } else {

      sourceHeight =
        image.width /
        boxRatio;

      sourceY =
        (
          image.height -
          sourceHeight
        ) / 2;

    }


    ctx.drawImage(
      image,

      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,

      x,
      y,
      width,
      height
    );

  }


  /*
  ΣΤΡΟΓΓΥΛΕΜΕΝΟ ΠΛΑΙΣΙΟ
  */

  function roundedRect(
    x,
    y,
    width,
    height,
    radius
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x + radius,
      y
    );


    ctx.arcTo(
      x + width,
      y,
      x + width,
      y + height,
      radius
    );


    ctx.arcTo(
      x + width,
      y + height,
      x,
      y + height,
      radius
    );


    ctx.arcTo(
      x,
      y + height,
      x,
      y,
      radius
    );


    ctx.arcTo(
      x,
      y,
      x + width,
      y,
      radius
    );


    ctx.closePath();

  }


  /*
  ΣΧΗΜΑ ΚΑΡΔΙΑΣ
  */

  function heartPath(
    centerX,
    centerY,
    size
  ) {

    const s =
      size;


    ctx.beginPath();


    ctx.moveTo(
      centerX,
      centerY +
      s * 0.36
    );


    ctx.bezierCurveTo(
      centerX -
      s * 0.78,

      centerY -
      s * 0.05,

      centerX -
      s * 0.52,

      centerY -
      s * 0.72,

      centerX,

      centerY -
      s * 0.34
    );


    ctx.bezierCurveTo(
      centerX +
      s * 0.52,

      centerY -
      s * 0.72,

      centerX +
      s * 0.78,

      centerY -
      s * 0.05,

      centerX,

      centerY +
      s * 0.36
    );


    ctx.closePath();

  }


  /*
  ΞΥΛΙΝΗ ΥΦΗ
  */

  function drawWoodBackground() {

    const gradient =
      ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );


    gradient.addColorStop(
      0,
      "#d8a36e"
    );


    gradient.addColorStop(
      0.5,
      "#c99059"
    );


    gradient.addColorStop(
      1,
      "#ad713f"
    );


    ctx.fillStyle =
      gradient;


    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    ctx.globalAlpha =
      0.12;


    ctx.strokeStyle =
      "#6f4124";


    ctx.lineWidth =
      2;


    for (
      let y = 18;
      y < canvas.height;
      y += 26
    ) {

      ctx.beginPath();


      for (
        let x = 0;
        x <= canvas.width;
        x += 50
      ) {

        const offset =
          Math.sin(
            (x + y) / 60
          ) * 7;


        if (x === 0) {

          ctx.moveTo(
            x,
            y + offset
          );

        } else {

          ctx.lineTo(
            x,
            y + offset
          );

        }

      }


      ctx.stroke();

    }


    ctx.globalAlpha =
      1;

  }


  /*
  ΚΕΝΤΡΙΚΟ ΚΑΔΡΟ
  */

  function drawFrameBoard() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    const background =
      ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
      );


    background.addColorStop(
      0,
      "#f2d8c7"
    );


    background.addColorStop(
      1,
      "#d9a781"
    );


    ctx.fillStyle =
      background;


    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    ctx.save();


    ctx.shadowColor =
      "rgba(53,26,18,.30)";


    ctx.shadowBlur =
      34;


    ctx.shadowOffsetY =
      18;


    roundedRect(
      110,
      90,
      860,
      1110,
      34
    );


    ctx.fillStyle =
      "#7e4b2e";


    ctx.fill();


    ctx.restore();


    roundedRect(
      135,
      115,
      810,
      1060,
      26
    );


    ctx.save();


    roundedRect(
      135,
      115,
      810,
      1060,
      26
    );


    ctx.clip();


    drawWoodBackground();


    ctx.restore();


    ctx.strokeStyle =
      "rgba(93,50,28,.55)";


    ctx.lineWidth =
      5;


    roundedRect(
      135,
      115,
      810,
      1060,
      26
    );


    ctx.stroke();

  }


  /*
  ΔΙΑΤΑΞΗ ΦΩΤΟΓΡΑΦΙΩΝ
  */

  function drawPhotoLayout() {

    const x = 195;

    const y = 470;

    const width = 690;

    const height = 570;

    const gap = 12;

    const slots = [];


    if (
      state.photoCount === 1
    ) {

      slots.push(
        [
          x,
          y,
          width,
          height
        ]
      );

    }


    else if (
      state.photoCount === 2
    ) {

      slots.push(
        [
          x,
          y,
          (width - gap) / 2,
          height
        ],

        [
          x +
          (width + gap) / 2,

          y,

          (width - gap) / 2,

          height
        ]
      );

    }


    else if (
      state.photoCount === 3
    ) {

      slots.push(

        [
          x,
          y,

          width * 0.58 -
          gap / 2,

          height
        ],

        [
          x +
          width * 0.58 +
          gap / 2,

          y,

          width * 0.42 -
          gap / 2,

          (height - gap) / 2
        ],

        [
          x +
          width * 0.58 +
          gap / 2,

          y +
          (height + gap) / 2,

          width * 0.42 -
          gap / 2,

          (height - gap) / 2
        ]

      );

    }


    else {

      const slotWidth =
        (width - gap) / 2;


      const slotHeight =
        (height - gap) / 2;


      slots.push(

        [
          x,
          y,
          slotWidth,
          slotHeight
        ],

        [
          x +
          slotWidth +
          gap,

          y,

          slotWidth,
          slotHeight
        ],

        [
          x,

          y +
          slotHeight +
          gap,

          slotWidth,
          slotHeight
        ],

        [
          x +
          slotWidth +
          gap,

          y +
          slotHeight +
          gap,

          slotWidth,
          slotHeight
        ]

      );

    }


    slots.forEach(
      (
        slot,
        index
      ) => {

        const [
          slotX,
          slotY,
          slotWidth,
          slotHeight
        ] = slot;


        ctx.save();


        roundedRect(
          slotX,
          slotY,
          slotWidth,
          slotHeight,
          18
        );


        ctx.clip();


        if (
          state.photos[index]
        ) {

          drawCover(

            state.photos[index],

            slotX,
            slotY,
            slotWidth,
            slotHeight

          );

        } else {

          ctx.fillStyle =
            "rgba(255,245,236,.72)";


          ctx.fillRect(
            slotX,
            slotY,
            slotWidth,
            slotHeight
          );


          ctx.fillStyle =
            "#6b294f";


          ctx.textAlign =
            "center";


          ctx.font =
            "700 26px Arial";


          ctx.fillText(
            `Φωτογραφία ${index + 1}`,

            slotX +
            slotWidth / 2,

            slotY +
            slotHeight / 2
          );

        }


        ctx.restore();


        ctx.strokeStyle =
          "rgba(83,43,28,.42)";


        ctx.lineWidth =
          3;


        roundedRect(
          slotX,
          slotY,
          slotWidth,
          slotHeight,
          18
        );


        ctx.stroke();

      }
    );

  }


  /*
  ΚΕΙΜΕΝΟ
  */

  function drawTextZone() {

    const x = 575;

    const y = 180;

    const width = 300;

    const height = 210;


    ctx.save();


    roundedRect(
      x,
      y,
      width,
      height,
      18
    );


    ctx.fillStyle =
      "rgba(255,247,239,.23)";


    ctx.fill();


    ctx.restore();


    if (
      state.textMode ===
      "handwritten" &&

      state.handwriting
    ) {

      ctx.save();


      roundedRect(
        x,
        y,
        width,
        height,
        18
      );


      ctx.clip();


      drawCover(
        state.handwriting,
        x,
        y,
        width,
        height
      );


      ctx.restore();

    } else {

      const text =
        state.text.trim() ||

        "Πρόσθεσε το κείμενό σου";


      ctx.fillStyle =
        "#4c2b23";


      ctx.textAlign =
        "center";


      ctx.font =
        state.text.trim()

        ? "600 30px Georgia"

        : "700 24px Arial";


      wrapText(

        text,

        x +
        width / 2,

        y + 55,

        width - 34,

        38,

        5

      );

    }

  }


  /*
  ΚΕΙΜΕΝΟ ΠΟΛΛΩΝ ΓΡΑΜΜΩΝ
  */

  function wrapText(
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    maxLines
  ) {

    const words =
      text.split(/\s+/);


    const lines = [];


    let line = "";


    for (
      const word of words
    ) {

      const test =
        line

        ? `${line} ${word}`

        : word;


      if (
        ctx.measureText(test).width >
        maxWidth &&

        line
      ) {

        lines.push(line);

        line = word;


        if (
          lines.length >=
          maxLines - 1
        ) {

          break;

        }

      } else {

        line = test;

      }

    }


    if (
      line &&
      lines.length < maxLines
    ) {

      lines.push(line);

    }


    lines.forEach(
      (
        currentLine,
        index
      ) => {

        ctx.fillText(

          currentLine,

          x,

          y +
          index *
          lineHeight

        );

      }
    );

  }


  /*
  ΜΠΡΕΛΟΚ
  */

  function drawKeychains() {

    const centerY = 325;

    const size = 145;


    const centers = [
      365,
      525
    ];


    centers.forEach(
      (
        centerX,
        index
      ) => {

        ctx.save();


        heartPath(
          centerX,
          centerY,
          size
        );


        ctx.clip();


        const image =
          index === 0

          ? state.key1Photo

          : state.key2Photo;


        const mode =
          index === 0

          ? state.key1Mode

          : state.key2Mode;


        const text =
          index === 0

          ? state.key1Text

          : state.key2Text;


        ctx.fillStyle =
          "#c99059";


        ctx.fillRect(

          centerX -
          size,

          centerY -
          size,

          size * 2,

          size * 2

        );


        if (
          mode === "photo" &&
          image
        ) {

          drawCover(

            image,

            centerX -
            size,

            centerY -
            size,

            size * 2,

            size * 2

          );

        } else {

          ctx.fillStyle =
            "#4d2c22";


          ctx.textAlign =
            "center";


          ctx.font =
            "700 23px Arial";


          const label =

            mode === "text" &&
            text.trim()

            ? text.trim()

            : `Μπρελόκ ${index + 1}`;


          wrapText(

            label,

            centerX,

            centerY - 5,

            size * 1.45,

            27,

            3

          );

        }


        ctx.restore();


        ctx.strokeStyle =
          "rgba(76,41,27,.72)";


        ctx.lineWidth =
          5;


        heartPath(
          centerX,
          centerY,
          size
        );


        ctx.stroke();


        ctx.fillStyle =
          "#5c3426";


        ctx.beginPath();


        ctx.arc(

          centerX,

          centerY -
          size * 0.45,

          10,

          0,

          Math.PI * 2

        );


        ctx.fill();

      }
    );


    ctx.strokeStyle =
      "rgba(76,41,27,.85)";


    ctx.lineWidth =
      4;


    ctx.beginPath();


    ctx.moveTo(
      445,
      230
    );


    ctx.lineTo(
      445,
      435
    );


    ctx.stroke();

  }


  /*
  NFC
  */

  function drawNfcBadge() {

    const x = 765;

    const y = 1040;


    ctx.fillStyle =
      "rgba(255,247,239,.38)";


    roundedRect(
      x,
      y,
      135,
      90,
      16
    );


    ctx.fill();


    ctx.fillStyle =
      "#4d2b22";


    ctx.textAlign =
      "center";


    ctx.font =
      "900 30px Arial";


    ctx.fillText(
      "NFC",
      x + 67,
      y + 45
    );


    ctx.font =
      "700 14px Arial";


    ctx.fillText(

      state.nfcMode === "full"

      ? "Πλήρης σελίδα"

      : "Tap για αναμνήσεις",

      x + 67,

      y + 68

    );

  }


  /*
  ΤΙΤΛΟΣ ΠΡΟΕΠΙΣΚΟΠΗΣΗΣ
  */

  function drawTitle() {

    ctx.fillStyle =
      "#fff5ec";


    ctx.textAlign =
      "center";


    ctx.font =
      "900 36px Georgia";


    ctx.fillText(

      "Η δική σου Premium δημιουργία",

      canvas.width / 2,

      1260

    );

  }


  /*
  ΠΛΗΡΗΣ ΑΝΑΝΕΩΣΗ
  */

  function render() {

    drawFrameBoard();

    drawKeychains();

    drawTextZone();

    drawPhotoLayout();

    drawNfcBadge();

    drawTitle();

  }


  /*
  ΑΡΙΘΜΟΣ ΦΩΤΟΓΡΑΦΙΩΝ
  */

  function setPhotoCount(count) {

    state.photoCount =
      count;


    photoCountLabel.textContent =
      String(count);


    document
      .querySelectorAll(
        "#photoCountButtons button"
      )
      .forEach(button => {

        button.classList.toggle(

          "active",

          Number(
            button.dataset.count
          ) === count

        );

      });


    buildPhotoInputs();

    render();

  }


  /*
  ΔΗΜΙΟΥΡΓΙΑ UPLOAD ΠΕΔΙΩΝ
  */

  function buildPhotoInputs() {

    photoInputs.innerHTML =
      "";


    for (
      let index = 0;

      index <
      state.photoCount;

      index++
    ) {

      const label =
        document.createElement(
          "label"
        );


      label.className =

        "upload-card" +

        (
          state.photoFiles[index]

          ? " has-file"

          : ""
        );


      label.innerHTML = `

        <input

          type="file"

          accept="image/*"

          name="Φωτογραφία κάδρου ${index + 1}"

          data-photo-index="${index}"

          form="orderForm"

        >

        <span>

          ${
            state.photoFiles[index]

            ? "Αλλαγή φωτογραφίας"

            : `Πρόσθεσε φωτογραφία ${index + 1}`
          }

        </span>

        <small>

          ${
            state.photoFiles[index]

            ? state.photoFiles[index].name

            : "ΠΑΤΑ ΕΔΩ"
          }

        </small>

      `;


      photoInputs.appendChild(
        label
      );

    }


    photoInputs
      .querySelectorAll(
        "input"
      )
      .forEach(input => {

        input.addEventListener(
          "change",
          () => {

            const index =
              Number(
                input.dataset.photoIndex
              );


            const file =
              input.files[0] ||
              null;


            state.photoFiles[index] =
              file;


            loadImage(
              file,
              image => {

                state.photos[index] =
                  image;


                buildPhotoInputs();

                render();

              }
            );

          }
        );

      });

  }


  document
    .querySelectorAll(
      "#photoCountButtons button"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          setPhotoCount(

            Number(
              button.dataset.count
            )

          );

        }
      );

    });


  /*
  ΚΕΙΜΕΝΟ / ΧΕΙΡΟΓΡΑΦΟ
  */

  document
    .querySelectorAll(
      "[data-text-mode]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          state.textMode =
            button.dataset.textMode;


          document
            .querySelectorAll(
              "[data-text-mode]"
            )
            .forEach(item => {

              item.classList.toggle(
                "active",
                item === button
              );

            });


          document
            .getElementById(
              "typedTextArea"
            )
            .hidden =

            state.textMode !==
            "typed";


          document
            .getElementById(
              "handwritingArea"
            )
            .hidden =

            state.textMode !==
            "handwritten";


          render();

        }
      );

    });


  frameText.addEventListener(
    "input",
    () => {

      state.text =
        frameText.value;

      render();

    }
  );


  handwritingFile.addEventListener(
    "change",
    () => {

      const file =
        handwritingFile.files[0] ||
        null;


      state.handwritingFile =
        file;


      loadImage(
        file,
        image => {

          state.handwriting =
            image;

          render();

        }
      );

    }
  );


  /*
  ΜΠΡΕΛΟΚ
  */

  function bindKeychain(number) {

    const mode =
      number === 1

      ? key1Mode

      : key2Mode;


    const photo =
      number === 1

      ? key1Photo

      : key2Photo;


    const text =
      number === 1

      ? key1Text

      : key2Text;


    const photoWrap =
      document.getElementById(

        number === 1

        ? "key1PhotoWrap"

        : "key2PhotoWrap"

      );


    mode.addEventListener(
      "change",
      () => {

        state[
          `key${number}Mode`
        ] = mode.value;


        photoWrap.hidden =
          mode.value !==
          "photo";


        text.hidden =
          mode.value !==
          "text";


        render();

      }
    );


    photo.addEventListener(
      "change",
      () => {

        const file =
          photo.files[0] ||
          null;


        state[
          `key${number}File`
        ] = file;


        loadImage(
          file,
          image => {

            state[
              `key${number}Photo`
            ] = image;


            render();

          }
        );

      }
    );


    text.addEventListener(
      "input",
      () => {

        state[
          `key${number}Text`
        ] = text.value;


        render();

      }
    );

  }


  bindKeychain(1);

  bindKeychain(2);


  /*
  NFC
  */

  document
    .querySelectorAll(
      'input[name="NFC επιλογή"]'
    )
    .forEach(input => {

      input.addEventListener(
        "change",
        () => {

          state.nfcMode =

            input.value ===
            "Πλήρης NFC σελίδα"

            ? "full"

            : "simple";


          document
            .querySelectorAll(
              ".nfc-choice"
            )
            .forEach(label => {

              const radio =
                label.querySelector(
                  'input[name="NFC επιλογή"]'
                );


              label.classList.toggle(
                "active",
                radio.checked
              );

            });


          render();

        }
      );

    });


  nfcFile.addEventListener(
    "change",
    () => {

      state.nfcFile =

        nfcFile.files[0] ||
        null;

    }
  );


  /*
  ΤΙ ΛΕΙΠΕΙ ΑΠΟ ΤΗ ΔΗΜΙΟΥΡΓΙΑ
  */

  function missingItems() {

    const missing = [];


    const usedPhotos =

      state.photoFiles

        .slice(
          0,
          state.photoCount
        )

        .filter(Boolean)

        .length;


    if (
      usedPhotos === 0
    ) {

      missing.push(
        "καμία φωτογραφία στο κάδρο"
      );

    }


    else if (
      usedPhotos <
      state.photoCount
    ) {

      missing.push(

        `${
          state.photoCount -
          usedPhotos
        } φωτογραφία/ες από τη διάταξη`

      );

    }


    const hasText =

      state.textMode ===
      "typed"

      ? state.text.trim()

      : Boolean(
          state.handwritingFile
        );


    if (
      !hasText
    ) {

      missing.push(
        "κείμενο ή χειρόγραφο"
      );

    }


    const key1Missing =

      state.key1Mode ===
      "photo"

      ? !state.key1File

      : !state.key1Text.trim();


    if (
      key1Missing
    ) {

      missing.push(
        "περιεχόμενο στο 1ο μπρελόκ"
      );

    }


    const key2Missing =

      state.key2Mode ===
      "photo"

      ? !state.key2File

      : !state.key2Text.trim();


    if (
      key2Missing
    ) {

      missing.push(
        "περιεχόμενο στο 2ο μπρελόκ"
      );

    }


    if (
      state.nfcMode ===
      "simple" &&

      !state.nfcFile
    ) {

      missing.push(
        "περιεχόμενο NFC"
      );

    }


    return missing;

  }


  /*
  ΠΕΡΙΛΗΨΗ ΓΙΑ EMAIL
  */

  function summaryText() {

    const usedPhotos =

      state.photoFiles

        .slice(
          0,
          state.photoCount
        )

        .filter(Boolean)

        .length;


    return [

      "Premium δημιουργία",

      `Διάταξη φωτογραφιών: ${state.photoCount}`,

      `Φωτογραφίες που ανέβηκαν: ${usedPhotos}`,

      `Κείμενο: ${
        state.textMode === "typed"

        ? (
            state.text.trim() ||
            "Δεν προστέθηκε"
          )

        : (
            state.handwritingFile

            ? "Χειρόγραφο αρχείο"

            : "Δεν προστέθηκε"
          )
      }`,

      `Μπρελόκ 1: ${
        state.key1Mode === "photo"

        ? (
            state.key1File

            ? "Φωτογραφία"

            : "Κενό"
          )

        : (
            state.key1Text.trim() ||
            "Κενό"
          )
      }`,

      `Μπρελόκ 2: ${
        state.key2Mode === "photo"

        ? (
            state.key2File

            ? "Φωτογραφία"

            : "Κενό"
          )

        : (
            state.key2Text.trim() ||
            "Κενό"
          )
      }`,

      `NFC: ${
        state.nfcMode === "full"

        ? "Πλήρης NFC σελίδα (+10€)"

        : "Απλό NFC (περιλαμβάνεται)"
      }`

    ].join(" | ");

  }


  /*
  ΤΕΛΙΚΗ ΠΡΟΕΠΙΣΚΟΠΗΣΗ
  */

  function openPreview() {

    render();


    finalPreviewImage.src =

      canvas.toDataURL(
        "image/png"
      );


    previewModal.hidden =
      false;

  }


  document
    .getElementById(
      "previewBtn"
    )
    .addEventListener(
      "click",
      openPreview
    );


  /*
  ΑΠΟΣΤΟΛΗ
  */

  function openSendFlow() {

    const missing =
      missingItems();


    if (
      missing.length
    ) {

      missingText.innerHTML =

        `Δεν έχετε προσθέσει:
        <strong>
        ${missing.join(", ")}
        </strong>.
        <br><br>
        Θέλετε να συνεχίσουμε
        με τη δημιουργία όπως είναι τώρα;`;


      missingModal.hidden =
        false;

    } else {

      document
        .getElementById(
          "contactBox"
        )
        .scrollIntoView({
          behavior: "smooth"
        });

    }

  }


  document
    .getElementById(
      "openSendPanel"
    )
    .addEventListener(
      "click",
      openSendFlow
    );


  document
    .getElementById(
      "sendFromPreview"
    )
    .addEventListener(
      "click",
      () => {

        previewModal.hidden =
          true;

        openSendFlow();

      }
    );


  document
    .getElementById(
      "confirmSend"
    )
    .addEventListener(
      "click",
      () => {

        missingModal.hidden =
          true;


        document
          .getElementById(
            "contactBox"
          )
          .scrollIntoView({
            behavior: "smooth"
          });

      }
    );


  /*
  ΚΛΕΙΣΙΜΟ POPUPS
  */

  document
    .querySelectorAll(
      "[data-close-modal]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          missingModal.hidden =
            true;

        }
      );

    });


  document
    .querySelectorAll(
      "[data-close-preview]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          previewModal.hidden =
            true;

        }
      );

    });


  document
    .querySelectorAll(
      "[data-close-info]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          infoModal.hidden =
            true;

        }
      );

    });


  /*
  ΕΠΕΞΗΓΗΣΕΙΣ NFC
  */

  const info = {

    simple: {

      title:
        "Απλό NFC",

      image:
        "aplo%20nfc.png",

      text:
        "Με ένα tap στο κάδρο ανοίγει μία φωτογραφία ή ένα βίντεο."

    },


    full: {

      title:
        "Πλήρης NFC σελίδα",

      image:
        "olokliromeni%20nfc.png",

      text:
        "Μία ολοκληρωμένη προσωπική σελίδα με κεντρική φωτογραφία, βίντεο, έως 5 φωτογραφίες, μουσική και αφιέρωση."

    }

  };


  document
    .querySelectorAll(
      "[data-info]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const data =
            info[
              button.dataset.info
            ];


          infoTitle.textContent =
            data.title;


          infoImage.src =
            data.image;


          infoImage.alt =
            data.title;


          infoText.textContent =
            data.text;


          infoModal.hidden =
            false;

        }
      );

    });


  /*
  ΔΗΜΙΟΥΡΓΙΑ ΕΙΚΟΝΑΣ PREVIEW
  ΓΙΑ ΤΟ EMAIL
  */

  function canvasToFileInput() {

    return new Promise(
      resolve => {

        canvas.toBlob(
          blob => {

            if (
              !blob
            ) {

              resolve(false);

              return;

            }


            try {

              const file =
                new File(

                  [blob],

                  "premium-preview.png",

                  {
                    type:
                      "image/png"
                  }

                );


              const transfer =
                new DataTransfer();


              transfer.items.add(
                file
              );


              document
                .getElementById(
                  "previewFileInput"
                )
                .files =

                transfer.files;


              resolve(true);

            } catch (
              error
            ) {

              resolve(false);

            }

          },

          "image/png",

          0.92
        );

      }
    );

  }


  /*
  ΣΥΝΟΛΙΚΟ ΜΕΓΕΘΟΣ UPLOAD
  */

  function totalUploadSize() {

    let total = 0;


    const inputs =
      document.querySelectorAll(
        'input[type="file"][form="orderForm"], #orderForm input[type="file"]'
      );


    inputs.forEach(
      input => {

        Array
          .from(
            input.files || []
          )
          .forEach(
            file => {

              total +=
                file.size;

            }
          );

      }
    );


    return total;

  }


  /*
  ΤΕΛΙΚΗ ΥΠΟΒΟΛΗ
  */

  orderForm.addEventListener(
    "submit",
    async event => {

      if (
        !orderForm.checkValidity()
      ) {

        return;

      }


      event.preventDefault();


      if (
        totalUploadSize() >
        MAX_TOTAL_UPLOAD
      ) {

        alert(
          "Τα αρχεία είναι πολύ μεγάλα. Για μεγάλα βίντεο ή πολλά αρχεία NFC, στείλε μας το υλικό σου μέσω Viber."
        );

        return;

      }


      document
        .getElementById(
          "summaryField"
        )
        .value =

        summaryText();


      await canvasToFileInput();


      const submitButton =
        orderForm.querySelector(
          ".send-btn"
        );


      submitButton.disabled =
        true;


      submitButton.textContent =
        "Αποστολή...";


      orderForm.submit();

    }
  );


  /*
  ΚΟΙΝΟΠΟΙΗΣΗ
  */

  document
    .getElementById(
      "shareBtn"
    )
    .addEventListener(
      "click",
      async () => {

        try {

          if (
            navigator.share
          ) {

            await navigator.share({

              title:
                SHARE_TITLE,

              text:
                SHARE_TEXT,

              url:
                SHARE_URL

            });

          } else {

            await navigator
              .clipboard
              .writeText(
                SHARE_URL
              );


            showToast(
              "Το link αντιγράφηκε."
            );

          }

        } catch (
          error
        ) {

          if (
            error &&
            error.name !==
            "AbortError"
          ) {

            showToast(
              "Δεν ήταν δυνατή η κοινοποίηση."
            );

          }

        }

      }
    );


  /*
  ΜΙΚΡΟ ΜΗΝΥΜΑ
  */

  function showToast(
    message
  ) {

    const toast =
      document.getElementById(
        "toast"
      );


    toast.textContent =
      message;


    toast.classList.add(
      "show"
    );


    clearTimeout(
      window.__toastTimer
    );


    window.__toastTimer =
      setTimeout(
        () => {

          toast.classList.remove(
            "show"
          );

        },

        2200
      );

  }


  /*
  ΕΠΙΒΕΒΑΙΩΣΗ ΑΠΟΣΤΟΛΗΣ
  */

  const params =
    new URLSearchParams(
      location.search
    );


  if (
    params.get("sent") ===
    "1"
  ) {

    showToast(
      "Η δημιουργία σου στάλθηκε."
    );

  }


  /*
  ΕΚΚΙΝΗΣΗ
  */

  buildPhotoInputs();

  render();

})();
