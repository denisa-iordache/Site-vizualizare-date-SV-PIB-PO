//Preluarea datelor din json:
let cerere = new XMLHttpRequest();
cerere.open("GET", "media/eurostat.json", false);
cerere.send(null);
let json = JSON.parse(cerere.responseText); //in variabila json o sa am datele citite din fisier

function colorareInScalaDeCulori(
  //functie folosita la bubbleChart pentru colorarea conturului bulelor in functie de media uniunii pentru indicatorul ce reprezinta bula, pentru anul selectat, in barChart pentru colorarea barelor in functie de media anilor pentru indicatorul si tara aleasa si in tabel pentru colorarea celulelor in functie de distanta fata de media uniunii pentru fiecare indicator
  valoare_celula,
  valoare_minima_coloana,
  valoare_maxima_coloana
) {
  let maxMinusMin = valoare_maxima_coloana - valoare_minima_coloana;
  let normalizare_valoare;
  normalizare_valoare =
    ((valoare_celula - valoare_minima_coloana) / maxMinusMin) * 100; //realizez normalizarea, adica trecere in procente a valorilor, 0 va corespunde celei mai mici valori, 100 celei mai mari

  let red;
  let green;
  let blue;
  if (normalizare_valoare <= 50) {
    //normalizare_valoare=50 va corespunde mediei
    red = 255; //red va lua valoarea 255 deoarece ce e sub medie se coloreaza de la rosu la galben
    green = Math.round(5.1 * normalizare_valoare); //folosesc 5.1 deoarece 5.1*50=255, adica, media va fi colorata cu galben (red=255, green=255, blue=0); folosesc round deoarece aceasta va fi reprezentatia pentru green in rgb
    blue = 0; //blue este 0 deoarece nu il folosesc in colorare
  } else {
    green = 255; //green va lua valoarea 255 deoarece ce e peste medie se coloreaza de la galben la verde
    red = Math.round(510 - 5.1 * normalizare_valoare); //sarind de 50, 5.1*normalizare_valoare depaseste 255, deci pentru a putea ajunge la o valoare maxima pentru red de 255 o sa scad 5.1*procent din 510
    blue = 0; //blue este 0 deoarece nu il folosesc in colorare
  }
  return "rgb(" + red + "," + green + "," + blue + ")"; //returnez culoarea in codul RGB
}

function colorareInScalaDeCuloriTransparent(
  //functie folosita la bubbleChart pentru colorarea in functie de media uniunii pentru indicatorul ce reprezinta bula, pentru anul selectat
  //in plus fata de functia precedenta la returnarea culorii adaug si transparenta pentru a fi vizibile toate bulele din grafic, in cazul in care acestea se suprapun
  valoare_celula,
  valoare_minima_coloana,
  valoare_maxima_coloana
) {
  let maxMinusMin = valoare_maxima_coloana - valoare_minima_coloana;
  let normalizare_valoare;
  normalizare_valoare =
    ((valoare_celula - valoare_minima_coloana) / maxMinusMin) * 100; //realizez normalizarea, adica trecere in procente a valorilor, 0 va corespunde celei mai mici valori, 100 celei mai mari

  let red;
  let green;
  let blue;
  if (normalizare_valoare <= 50) {
    //normalizare_valoare=50 va corespunde mediei
    red = 255; //red va lua valoarea 255 deoarece ce e sub medie se coloreaza de la rosu la galben
    green = Math.round(5.1 * normalizare_valoare); //folosesc 5.1 deoarece 5.1*50=255, adica, media va fi colorata cu galgen (red=255, green=255, blue=0); folosesc round deoarece aceasta va fi reprezentatia pentru green in rgb
    blue = 0; //blue este 0 deoarece nu il folosesc in colorare
  } else {
    green = 255; //green va lua valoarea 255 deoarece ce e peste medie se coloreaza de la galben la verde
    red = Math.round(510 - 5.1 * normalizare_valoare); //sarind de 50, 5.1*normalizare_valoare depaseste 255, deci pentru a putea ajunge la o valoare maxima pentru red de 255 o sa scad 5.1*procent din 510
    blue = 0; //blue este 0 deoarece nu il folosesc in colorare
  }
  return "rgb(" + red + "," + green + "," + blue + "," + 0.3 + ")"; //returnez culoarea in codul RGB -> a patra valoare de 0.3 reprezentand opacity, avand transparenta de 0.7
}

//CERINTA 2 - afișare grafică evoluție pentru un indicator (PIB/SV/Pop) și o țară selectată de către utilizator - se va folosi un element de tip SVG (grafică vectorială)

const barChart_div = document.createElement("div"); // in acest div voi avea graficul de tip svg
barChart_div.id = "barChart_div";
barChart_div.style.width = "600px";
barChart_div.style.height = "400px";

//voi avea formulare care sa contina butoanele si selecturile pentru fiecare cerinta care necesita select-uri

let formular_C2 = document.getElementById("formular-grafic-cerinta-2");

//voi folosi prepend in loc de appendChild pentru a adauga pe formulare deoarece butoanele sunt adaugate pe formulare din html (deci ar trebui sa apara primele la incarcarea paginii), iar eu vreau ca acestea sa apara in pagina ca si ultimele elemente din form

let select_indicatori = document.createElement("select"); //creez elementul de tip select in care imi voi pune cei trei indicatori
formular_C2.prepend(select_indicatori); //adaug select-ul in formular
let indicatori = []; //creez un vector gol in care o sa retin indicatorii, fiecare indicator aparand o singura data
json.forEach((element) => {
  //parcurg setul de date
  if (!indicatori.includes(element.indicator)) {
    //daca indicatorul din obiectul curent nu exista inca in vectorul indicatori, atunci il adaug
    indicatori.push(element.indicator);
  }
});
select_indicatori.setAttribute("id", "select_indicatori");
select_indicatori.classList.add("form-select"); //adaug select-ului meu clasa form-select din bootstrap
select_indicatori.classList.add("mb-1"); //si margin-bottom de 1, insemnand 0.25 rem

let label_barChartIndicatori = document.createElement("label"); //creez un element de tip label
label_barChartIndicatori.htmlFor = "select-indicatori"; //pentru select-indicatori
label_barChartIndicatori.innerHTML = "Selectati indicatorul:"; //unde o sa sugerez utilizatorului ce reprezinta select-ul
label_barChartIndicatori.classList.add("form-label"); //adaug label-ului meu clasa form-label din bootstrap
formular_C2.prepend(label_barChartIndicatori); //adaug labelul pe formular

indicatori.forEach((element) => {
  //fiecare element din vetctorul meu indicatori va reprezenta o optiune in select_indicatori
  let optiune_indicator = document.createElement("option");
  optiune_indicator.textContent = element;
  select_indicatori.appendChild(optiune_indicator);
  optiune_indicator.setAttribute("id", "option_indicator");
  optiune_indicator.classList.add("option_indicator");
});

//procedez la fel si in cazul selectului unde vreau sa retin cei tarile
let select_tari = document.createElement("select"); //creez elementul de tip select in care imi voi pune tarile
formular_C2.prepend(select_tari); //adaug select-ul in formular

let tari = []; //creez un vector gol in care o sa retin tarile, fiecare tara aparand o singura data
json.forEach((element) => {
  //parcurg setul de date
  if (!tari.includes(element.tara)) {
    //daca tara din obiectul curent nu exista inca in vectorul tari, atunci o adaug
    tari.push(element.tara);
  }
});
select_tari.setAttribute("id", "select_tari");
select_tari.classList.add("form-select"); //adaug selectului meu clasa form-select din bootstrap
select_tari.classList.add("mb-2"); //si margin-bottom de 2, insemnand 0.5 rem petru a se crea putin mai mult spatiu intre select si labelul urmator

let label_barChartTari = document.createElement("label"); //creez un element de tip label
label_barChartTari.htmlFor = "select-tari"; //pentru select-indicatori
label_barChartTari.innerHTML = "Selectati tara:"; //unde o sa sugerez utilizatorului ce reprezinta select-ul
label_barChartTari.classList.add("form-label"); //adaug label-ului meu clasa form-label din bootstrap
formular_C2.prepend(label_barChartTari); //adaug labelul pe formular

tari.forEach((element) => {
  //fiecare element din vetctorul meu tari va reprezenta o optiune in select_tari
  let optiune_tara = document.createElement("option");
  optiune_tara.textContent = element;
  select_tari.appendChild(optiune_tara);
  optiune_tara.setAttribute("id", "option_tara");
});

//Crearea BarChart-ului
class BarChart {
  #svgns;
  #domElement; //div
  #svg;
  #width;
  #height;
  /**
   * Constructs a new BarChart instance
   * @param {HTMLElement} domElement
   */
  constructor(domElement) {
    this.#domElement = domElement;
    this.#domElement = domElement;
    this.#svgns = "http://www.w3.org/2000/svg";
  }

  /**
   * Displays the bar chart
   * @param {Array} data
   */
  draw(data) {
    this.data = data;
    this.#width = this.#domElement.clientWidth;
    this.#height = this.#domElement.clientHeight;

    this.#createSVG();
    this.#drawBackground();
    this.#drawBars(data);
    this.#drawTitle();
  }
  #createSVG() {
    this.#svg = document.createElementNS(this.#svgns, "svg");
    this.#svg.setAttribute("width", this.#width);
    this.#svg.setAttribute("height", this.#height);
    this.#domElement.appendChild(this.#svg);
  }
  #drawBackground() {
    const rect = document.createElementNS(this.#svgns, "rect");
    rect.setAttribute("x", 0); //coordonatele de la care incepe desenarea dreptunghiului
    rect.setAttribute("y", 0);
    rect.setAttribute("height", this.#height);
    rect.setAttribute("width", this.#width);

    rect.style.fill = "aliceblue";

    this.#svg.appendChild(rect);
  }

  #drawTitle() {
    const text = document.createElementNS(this.#svgns, "text");
    text.appendChild(
      document.createTextNode(
        "BarChart " +
          select_tari.options[select_tari.selectedIndex].text +
          ", indicator " +
          select_indicatori.options[select_indicatori.selectedIndex].text
      ) //titlul graficului este compus din BarChart + tara selectata + indicatorul selectat
    );
    text.setAttribute("x", 10);
    text.setAttribute("y", 20);
    this.#svg.appendChild(text);
  }

  #drawBars(data) {
    const barWidth = this.#width / this.data.length;

    const values = this.data.map((x) => x[1]); //vectorul cu valorile de pe axa Oy, respectiv valorile indicatorului
    const maxValue = Math.max(...values); //gasesc cea mai mare valoare din vector
    const f = this.#height / maxValue; //si pe baza acestei valori calculez un factor de scalare cu care inmultesc toate valorile de pe axa vericala din vector

    const valuesNeNull = []; //creez un vector in care o sa pun toate valorile nenule ale indicatorului ales deoarece in colorarea barelor in functie de medie nu voi tine cont de aceste valori, acestea nereprezentand valoarea reala a indicatorului pentru tara nespectiva (Ex: speranta de viata nu poate fi nula), ci doar ca aceasta nu a fost declarata
    for (let i = 0; i < values.length; i++) {
      if (values[i] != null) {
        valuesNeNull.push(values[i]);
      }
    }

    //calculez valoarea minima si maxima a indicatorului necesare in colorare
    const maxValueIndicator = Math.max(...valuesNeNull);
    const minValueIndicator = Math.min(...valuesNeNull);

    for (let i = 0; i < this.data.length; i++) {
      const label = this.data[i][0]; //pe axa Ox o sa am anii
      const value = this.data[i][1]; //iar pe axa Oy valorile pentru indicatorul selectat

      const barHeight = value * f * 0.9; //inmultesc cu 0.9 pentru a lasa 10% spatiu liber deasupra celei mai inalte bare
      const barY = this.#height - barHeight;
      const barX = i * barWidth; //prima bara cu i=0 incepe de la coord 0, bara 2 cu index=1 incepe la barWidth unde se termina latimea primei bare

      const bar = document.createElementNS(this.#svgns, "rect");
      bar.setAttribute("class", "bar");
      bar.setAttribute("x", barX + barWidth / 4); //cord pe axa x va fi barX +barWidth/4 pt a centra, mutam bara cu un sfert din barWidth
      bar.setAttribute("y", barY);
      bar.setAttribute("height", barHeight);
      bar.setAttribute("width", barWidth / 2); //bara propriu-zisa o sa fie la jumatate din latimea barWidth, ramanand spatiu intre bare
      bar.style.fill = colorareInScalaDeCulori(
        value,
        minValueIndicator,
        maxValueIndicator
      ); //colorez barele in functie distanta fata de media indicatorului pentru cei 18 ani ai tarii selectate

      this.#svg.appendChild(bar);

      //CERINTA 3 -  pentru graficul de la punctul anterior să se afișeze un tooltip care să afișeze anul și valorile pentru PIB/SV/Pop pentru perioada corespunzătoare poziției mouse-ului

      let text;

      bar.addEventListener("mouseover", () => {
        //la pozitionarea cursorului peste o bara
        text = document.createElementNS(this.#svgns, "text");
        text.appendChild(document.createTextNode(label + " - " + value)); //adaug un text ce va contine anul si valoarea indicatorului pentru acel an
        text.setAttribute("x", barX);
        text.setAttribute("y", barY - 10); //scad 10 pentru ca textul sa se pozitioneze deasupra barei, sa nu se sprapuna cu aceasta
        this.#svg.appendChild(text);
        text.setAttribute("id", "txt");
        this.#svg.style = "overflow:visible"; //setez overflow:visible pentru ca atunci cand textul depaseste latimea graficului, acesta inca sa fie vizibil
      });
      bar.addEventListener("mouseleave", () => {
        //cand nu mai am cursorul pozitionat pe o bara
        if (this.#svg.contains(text)) this.#svg.removeChild(text); //va disparea textul care contine anul si valoarea pentru bara respectiva
      });
      bar.classList.add("bar");
    }
  }
}

const continut = document.getElementById("continut"); //in div-ul continut voi avea graficele create si tabelul, respectiv legenda pentru fiecare, dar la fiecare apasare de buton se va goli continutul div-ului si se va popula cu noile date
const barChart_container = document.createElement("div"); //div-ul barChart_container va contine div-ul cu graficul svg
barChart_container.id = "chart-container";

document.getElementById("button").addEventListener("click", function () {
  continut.innerHTML = ""; //golesc continutul curent
  barChart_div.innerHTML = ""; //golesc graficul curent svg, pentru a se reface cu datele noi de la noua apasare de buton
  barChart_div.style.borderColor = "#0275d8";
  barChart_div.style.borderWidth = "3px";
  barChart_div.style.borderStyle = "solid";

  const continutBarChart = document.createElement("div"); //div-ul mare, care va contine div-ul cu barChart-ul si legenda graficului
  continutBarChart.id = "continutBarChart";

  continut.appendChild(continutBarChart); //adaug la continut continutBarChart
  continutBarChart.appendChild(barChart_container); //adaug la continutBarChart barChart_container
  barChart_container.appendChild(barChart_div); //div-ul barChart_container va contine div-ul cu graficul svg

  const divLegenda = document.createElement("div"); //div-ul ce va contine legenda
  divLegenda.id = "divLegenda";

  const pLegenda = document.createElement("p"); //creez un paragraf unde o sa am textul din legenda
  pLegenda.innerHTML = "Legenda:";
  pLegenda.id = "pLegenda";
  divLegenda.appendChild(pLegenda); //adaug paragraful la legenda

  const ul = document.createElement("ul"); //creez o lista neordonata in care o sa specific ce reprezinta elementele din grafic
  ul.id = "ulLegenda";
  divLegenda.appendChild(ul); //adaug lista in div
  //fiecare element de pe grafic (Ox, Oy, BarColor, Tooltip) va reprezenta un item in lista
  const li1 = document.createElement("li");
  li1.innerHTML = "Axa Ox - Anul";
  const li2 = document.createElement("li");
  li2.innerHTML = "Axa Oy - Indicatorul Selectat";
  const li3 = document.createElement("li");
  li3.innerHTML =
    "Bar Color - Distanta fata de media tuturor anilor pentru indicatorul selectat la nivelul tarii selectate, scala de culoare fiind de la rosu (cea mai indepartata valoare de medie, mai mica decat aceasta) la verde (cea mai indepartata valoare de medie, mai mare decat aceasta).";
  const li4 = document.createElement("li");
  li4.innerHTML =
    "Tooltip - Afiseaza anul si valoarea indicatorului selectat la pozitionarea cursorului mouse-ului pe o bara.";
  //adaug item-urile in lista
  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);
  ul.appendChild(li4);
  continutBarChart.appendChild(divLegenda); //adaug legenda in continutBarChart

  const date = []; //in vector o sa retin perechile de valori (tara,valoare) care vor fi desenate pe grafic
  json.forEach((element) => {
    //pentru fiecare obiect din setul de date
    if (
      element.tara == select_tari.options[select_tari.selectedIndex].text && //daca tara selectata de utilizator coincide cu tara din setul de date
      element.indicator ==
        select_indicatori.options[select_indicatori.selectedIndex].text //si indicatorul selectat coincide cu indicatorul din setul de date
    ) {
      date.push([element.an, element.valoare]); //adaug in vector numele tarii si valoarea indicatorului
    }
  });
  const barChart = new BarChart(barChart_div);
  barChart.draw(date); //denenez barChart-ul cu valorile din vectorul date
});

//CERINTA 4 - afișare bubble chart pentru un an selectat de utilizator folosind un element de tip canvas (grafică raster)

let jsonSV = []; //in acest vector retin tarile cu indicatorul SV
for (let i = 0; i < tari.length; i++) {
  jsonSV.push(
    json.filter(
      (element) => element.indicator == "SV" && element.tara == tari[i]
    )
  );
}

let jsonPIB = []; //in acest vector retin tarile cu indicatorul PIB
for (let i = 0; i < tari.length; i++) {
  jsonPIB.push(
    json.filter(
      (element) => element.indicator == "PIB" && element.tara == tari[i]
    )
  );
}

let jsonPOP = []; //in acest vector retin tarile cu indicatorul POP
for (let i = 0; i < tari.length; i++) {
  jsonPOP.push(
    json.filter(
      (element) => element.indicator == "POP" && element.tara == tari[i]
    )
  );
}

let formular_C4 = document.getElementById("formular-grafic-cerinta-4"); //formularul in care am butonul si selectul petru ani pentru generarea bubbleChart-ului

//procedez la fel ca si la a doua cerinta, imi pun intr-un vector anii, care vor deveni optiunile din select

let select_ani = document.createElement("select");
formular_C4.prepend(select_ani);
let ani = [];
json.forEach((element) => {
  if (!ani.includes(element.an)) {
    ani.push(element.an);
  }
});

select_ani.setAttribute("id", "select_ani");
select_ani.classList.add("form-select");
select_ani.classList.add("mb-1");

let label_bubbleChartAni = document.createElement("label");
label_bubbleChartAni.htmlFor = "select_ani";
label_bubbleChartAni.innerHTML = "Selectati anul:";
label_bubbleChartAni.classList.add("form-label");
formular_C4.prepend(label_bubbleChartAni);

ani.forEach((element) => {
  let optiune_an = document.createElement("option");
  optiune_an.textContent = element;
  select_ani.appendChild(optiune_an);
  optiune_an.setAttribute("id", "option_an");
});

//Desenare bubbleChart
class BubbleChart {
  constructor(canvas) {
    this.canvas = canvas;
  }

  draw(values) {
    const context = this.canvas.getContext("2d");
    context.fillStyle = "aliceblue";

    context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const valsY = values.map((x) => x[2]); //vectorul cu valorile de pe axa Oy, respectiv valorile indicatorului POP
    const maxValueY = Math.max(...valsY); //gasesc cea mai mare valoare din vector
    const fY = this.canvas.height / maxValueY; //si pe baza acestei valori calculez un factor de scalare cu care inmultesc toate valorile de pe axa vericala din vector

    const valsX = values.map((x) => x[1]); //vectorul cu valorile de pe axa Ox, respectiv valorile indicatorului PIB
    const maxValueX = Math.max(...valsX); //gasesc cea mai mare valoare din vector
    const fX = this.canvas.width / maxValueX; //si pe baza acestei valori calculez un factor de scalare cu care inmultesc toate valorile de pe axa orizontala din vector

    const valsRaza = values.map((x) => x[0]); //vectorul cu valorile ce for reprezenta raza bulelor, respectiv valorile indicatorului SV
    const valuesNeNull = []; //creez un vector in care o sa pun toate valorile nenule ale indicatorului deoarece in colorarea barelor in functie de medie nu voi tine cont de aceste valori, acestea nereprezentand valoarea SV reala pentru tara nespectiva (speranta de viata nu poate fi nula), ci doar ca aceasta nu a fost declarata
    for (let i = 0; i < valsRaza.length; i++) {
      if (valsRaza[i] != null) {
        valuesNeNull.push(valsRaza[i]);
      }
    }
    const maxValueRaza = Math.max(...valuesNeNull);

    const minValueRaza = Math.min(...valuesNeNull);

    context.lineWidth = 2;
    for (let i = 0; i < values.length; i++) {
      const label = values[i][1]; //pe axa orizontala am PIB
      const value = values[i][2]; //pe axa verticala am POP
      const raza = values[i][0]; //raza unei bule va fi reprezentata in functie de SV
      const tara = values[i][3]; //tara va fi textul scris pe bule, o bula fiind reprezentativa pentru o tara

      const circleHeight = value * fY * 0.9; //inmultesc cu 0.9 pe a lasa 10% spatiu liber deasupra celei mai inalte bule
      const circleWidth = label * fX * 0.9; //inmultesc cu 0.9 pe a lasa 10% spatiu liber dupa ultima bula pe orizontala
      const circleX = circleWidth + 5; //adaug 5 pentru ca tara care are valoare pe verticala, dar null pe orizontala, sa fie vizibila
      const circleY = this.canvas.height - circleHeight - 5; //scad 5 pentru ca tara care are valoare pe orizontala, dar null pe verticala, sa fie vizibila

      context.beginPath();
      context.arc(circleX, circleY, raza / 6, 0 * Math.PI, 2 * Math.PI); //raza va fi logaritm natural din valoarea populatiei pentru a scala bine graficul; pentru a reprezenta un cerc complet, unghiul de start va fi 0, iar unghiul de opreire 2pi
      //raza cercului va fi valoarea SV impartita la 6 pentru a se incadra intr-o proportie buna pe grafic
      context.fillStyle = colorareInScalaDeCuloriTransparent(
        raza,
        minValueRaza,
        maxValueRaza
      ); //bulele se coloreaza in functie de valorea SV pentru tara pe care o reprezinta, insa vor avea transparenta pentru a fi vizibile si bulele care se suprapun cu acestea
      context.fill();
      context.strokeStyle = colorareInScalaDeCulori(
        //conturul bulelor va fi realizat cu culoarea cu care s-au umplut bulele, insa fara transparenta
        raza,
        minValueRaza,
        maxValueRaza
      );
      context.lineWidth = 0.5;
      context.stroke();
      context.fillStyle = "black";
      context.textAlign = "center";
      context.font = "bold 8px Times New Roman";
      context.fillText(tara, circleX, circleY + 2); //adaug numele tari pe fiecare bula centrat, cu culoarea negru, dimensiune de 8px, bold, TNR; adun 2 pentru ca textul sa apara cat mai in mijlocul bulei
    }
  }
}

let retineTimeout = []; //de fiecare data cand apelez setTimeout se va retine in acest vector id-ul timeout-ului(ceea ce returneaza setTimeout())

document
  .getElementById("button_cerinta_4")
  .addEventListener("click", function () {
    retineTimeout.forEach(function (retineTimeout) {
      //de fiecare daca cand se face click pe butonul Anfisare BubbleChart, golesc Timeout-ul pentru a ramane afisat pe ecran doar graficul cu bule pentru anul selectat, fara animatie
      clearTimeout(retineTimeout);
    });

    continut.innerHTML = ""; //golesc div-ul cu continutul site-ului pentru a se afisa doar graficul cu bule
    const canvasChart = document.createElement("canvas"); //creez elementul de tip canvas pe care se va desena graficul
    canvasChart.id = "canvasChart";
    canvasChart.width = 600;
    canvasChart.height = 400;

    const continutBubbleChart = document.createElement("div"); //div-ul ce va contine div-ul cu canvas-ul, denumirea axei verticale (yLabel) si legenda
    continutBubbleChart.id = "continutBubbleChart";

    const divCanvas = document.createElement("div"); //div-ul ce va contine canvas-ul
    divCanvas.id = "divCanvas";

    const yLabel = document.createElement("div"); //div-ul ce va contine numele axei verticale
    yLabel.id = "yLabel";
    yLabel.innerHTML = "Populatia";

    const divLegenda = document.createElement("div"); //div-ul ce va contine legenda
    divLegenda.id = "divLegenda";

    const pLegenda = document.createElement("p"); //creez un paragraf unde o sa am textul din legenda
    pLegenda.innerHTML = "Legenda:";
    pLegenda.id = "pLegenda";
    divLegenda.appendChild(pLegenda); //adaug paragraful la legenda

    const ul = document.createElement("ul"); //creez o lista neordonata in care o sa specific ce reprezinta elementele din grafic
    ul.id = "ulLegenda";
    divLegenda.appendChild(ul); //adaug lista in div
    //fiecare element de pe grafic (Ox, Oy, BubbleColor, BubbleSize) va reprezenta un item in lista
    const li1 = document.createElement("li");
    li1.innerHTML = "Axa Ox - Produsul Intern Brut";
    const li2 = document.createElement("li");
    li2.innerHTML = "Axa Oy - Populatia";
    const li3 = document.createElement("li");
    li3.innerHTML = "Bubble Size - Speranta de Viata";
    const li4 = document.createElement("li");
    li4.innerHTML =
      "Bubble Color - Distanta fata de media pentru Speranta de Viata la nivelul Uniunii Europene pentru anul selectat, scala de culoare fiind de la rosu (cea mai indepartata valoare de medie, mai mica decat aceasta) la verde (cea mai indepartata valoare de medie, mai mare decat aceasta).";
    //adaug item-urile in lista
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);

    const xLabel = document.createElement("div"); //div-ul ce va contine numele axei orizontale
    xLabel.id = "xLabel";
    xLabel.innerHTML = "Produsul intern brut";

    const context = canvasChart.getContext("2d");
    canvasChart.style.borderColor = "#0275d8";
    canvasChart.style.borderWidth = "3px";
    canvasChart.style.borderStyle = "solid";

    const date = []; //vectorul in care voi retine perechile de valori [sv,pib, pop,tara] pe baza caruia se va desena graficul

    let sv = []; //in vectorul sv retin toate valorile pentru speranta de viata unde anul elementului din json coincide cu anul selectat de utilizator
    for (let i = 0; i < jsonSV.length; i++) {
      for (let j = 0; j < jsonSV[i].length; j++) {
        if (
          jsonSV[i][j].an == select_ani.options[select_ani.selectedIndex].text
        ) {
          sv.push(jsonSV[i][j].valoare);
        }
      }
    }

    let pop = []; //in vectorul pop retin toate valorile pentru populatie unde anul elementului din json coincide cu anul selectat de utilizator
    for (let i = 0; i < jsonPOP.length; i++) {
      for (let j = 0; j < jsonPOP[i].length; j++) {
        if (
          jsonPOP[i][j].an == select_ani.options[select_ani.selectedIndex].text
        ) {
          pop.push(jsonPOP[i][j].valoare);
        }
      }
    }

    let pib = []; //in vectorul pib retin toate valorile pentru produsul intern brut unde anul elementului din json coincide cu anul selectat de utilizator
    for (let i = 0; i < jsonPIB.length; i++) {
      for (let j = 0; j < jsonPIB[i].length; j++) {
        if (
          jsonPIB[i][j].an == select_ani.options[select_ani.selectedIndex].text
        ) {
          pib.push(jsonPIB[i][j].valoare);
        }
      }
    }

    for (let i = 0; i < sv.length; i++) {
      //parcurg unul din vectorii creati (toti au aceeasi lungime)
      date.push([sv[i], pib[i], pop[i], tari[i]]); //adaug in vectorul meu date la fiecare iteratie valoarea pentru sv, pib, pop si tara
    }

    //console.log(date);
    //date.sort(([a, b, c,d], [e, f, g,h]) => b - f); //sortez crescator vectorul date in functie de PIB pentru a se aseza valorile in ordine crescatoare pe axa orizontala

    const bubbleChart = new BubbleChart(canvasChart);
    bubbleChart.draw(date); //desenez graficul cu valorile din vector
    context.fillStyle = "black";
    context.font = "17px Arial";
    context.fillText(
      "BubbleChart " + select_ani.options[select_ani.selectedIndex].text,
      80,
      20
    ); //adaug titlul graficului in fuctie de anul selectat, cu dimensiunea de 17px, font Arial, culoare negru

    divCanvas.appendChild(canvasChart); //adaug canvas-ul in div-ul divCanvas
    continutBubbleChart.appendChild(divCanvas); //adaug div-ul ce contine canvas-ul la continutBubbleChart
    continutBubbleChart.appendChild(divLegenda); //adaug legenda la continutBubbleChart
    continutBubbleChart.prepend(yLabel); //adaug ca prim element yLabel la continutBubbleChart
    continut.appendChild(xLabel); //adaug xLabel in continut (nu trebuie sa fie pe aceeasi linie cu restul, ci sub grafic)
    continut.prepend(continutBubbleChart); //adaug tot continutul cu cele 3 elemente deasupra xLabel
  });

//CERINTA 5 - animație bubble chart (afișare bubble chart succesiv pentru toți anii)

document
  .getElementById("button_cerinta_5")
  .addEventListener("click", function () {
    retineTimeout.forEach(function (retineTimeout) {
      //de fiecare daca cand se face click pe butonul Animatie BubbleChart, golesc Timeout-ul pentru a se relua animatia incepand cu anul 2000
      clearTimeout(retineTimeout);
    });

    continut.innerHTML = ""; //golesc div-ul continut pentru a se afisa doar graficul curent
    const canvasChart = document.createElement("canvas"); //creez elementul de tip canvas pe care se va desena graficul
    canvasChart.id = "canvasChart";
    canvasChart.width = 600;
    canvasChart.height = 400;

    const continutBubbleChart = document.createElement("div"); //div-ul ce va contine div-ul cu canvas-ul, denumirea axei verticale (yLabel) si legenda
    continutBubbleChart.id = "continutBubbleChart";

    const divCanvas = document.createElement("div"); //div-ul ce va contine canvas-ul
    divCanvas.id = "divCanvas";

    const yLabel = document.createElement("div"); //div-ul ce va contine numele axei verticale
    yLabel.id = "yLabel";
    yLabel.innerHTML = "Populatia";

    const divLegenda = document.createElement("div"); //div-ul ce va contine legenda
    divLegenda.id = "divLegenda";

    const pLegenda = document.createElement("p"); //creez un paragraf unde o sa am textul din legenda
    pLegenda.innerHTML = "Legenda:";
    pLegenda.id = "pLegenda";
    divLegenda.appendChild(pLegenda); //adaug paragraful la legenda

    const ul = document.createElement("ul"); //creez o lista neordonata in care o sa specific ce reprezinta elementele din grafic
    ul.id = "ulLegenda";
    divLegenda.appendChild(ul); //adaug lista in div
    //fiecare element de pe grafic (Ox, Oy, BubbleColor, BubbleSize) va reprezenta un item in lista
    const li1 = document.createElement("li");
    li1.innerHTML = "Axa Ox - Produsul Intern Brut";
    const li2 = document.createElement("li");
    li2.innerHTML = "Axa Oy - Populatia";
    const li3 = document.createElement("li");
    li3.innerHTML = "Bubble Size - Speranta de Viata";
    const li4 = document.createElement("li");
    li4.innerHTML =
      "Bubble Color - Distanta fata de media pentru Speranta de Viata la nivelul Uniunii Europene pentru anul afisat, scala de culoare fiind de la rosu (cea mai indepartata valoare de medie, mai mica decat aceasta) la verde (cea mai indepartata valoare de medie, mai mare decat aceasta).";
    //adaug item-urile in lista
    ul.appendChild(li1);
    ul.appendChild(li2);
    ul.appendChild(li3);
    ul.appendChild(li4);

    const xLabel = document.createElement("div"); //div-ul ce va contine denumirea axei orizontale
    xLabel.id = "xLabel";
    xLabel.innerHTML = "Produsul intern brut";

    const context = canvasChart.getContext("2d");
    canvasChart.style.borderColor = "#0275d8";
    canvasChart.style.borderWidth = "3px";
    canvasChart.style.borderStyle = "solid";
    const valuesSV = []; //vector in care salvez tarile care au ca indicator speranta de viata
    const valuesPOP = []; //vector in care salvez tarile care au ca indicator populatia
    const valuesPIB = []; //vector in care salvez tarile care au ca indicator produsul intern brut
    const date = []; //vectorul in care o sa am perechile [sv,pib,pop,tara] pentru toti anii

    for (let i = 0; i < select_ani.options.length; i++) {
      //parcurg toti anii
      for (j = 0; j < json.length; j++) {
        //si setul de date
        if (select_ani.options[i].value == json[j].an) {
          //daca anul elementului curent coincide cu anul din optiunile select-ului
          //impart setul de date in 3 array-uri in functie de indicator
          if (json[j].indicator == "SV") {
            valuesSV.push(json[j].valoare);
          } else if (json[j].indicator == "POP") {
            valuesPOP.push(json[j].valoare);
          } else if (json[j].indicator == "PIB") {
            valuesPIB.push(json[j].valoare);
          }
        }
      }
    }

    //in vectorii urmatori o sa am vectori separati (vector de vectori) pentru fiecare indicator fiecare an, pasul fiind 27 petru ca am 27 tari
    let vectorSV = [];
    let vectorPIB = [];
    let vectorPOP = [];
    for (let i = 0; i < valuesSV.length; i += 27) {
      vectorSV.push(valuesSV.slice(i, i + 27));
    }

    for (let i = 0; i < valuesPIB.length; i += 27) {
      vectorPIB.push(valuesPIB.slice(i, i + 27));
    }
    for (let i = 0; i < valuesPOP.length; i += 27) {
      vectorPOP.push(valuesPOP.slice(i, i + 27));
    }

    for (let i = 0; i < vectorSV.length; i++) {
      //parcurg unul din vectori (toti au aceeasi lungime)
      for (let j = 0; j < vectorSV[i].length; j++) {
        //si parcurg fiecare vector din vectorul mare in parte (practic, fiecare an)
        date.push([vectorSV[i][j], vectorPIB[i][j], vectorPOP[i][j], tari[j]]); //adaug in vectorul meu date, valoarea sv, pib, pop si tara
        //acum voi avea din nou datele neseparate pe ani, dar in ordine corecta
      }
    }

    let dateFinal = []; //array triplu : array-ul ce contine 19 array-uri pentru 19 ani, array-urile pentru fiecare an ce vor contine fiecare 27 array-uri pentru 27 tari si array-urile ce reprezinta o tara cu sv, pib, pop, tara
    for (let i = 0; i < date.length; i += 27) {
      //merg cu pasul 27 pentru a imparti vectorul in mai multi vectori in functie de an (un an are 27 tari)
      dateFinal.push(date.slice(i, i + 27));
    }

    // for (let i = 0; i < dateFinal.length; i++) {
    //   dateFinal[i].sort(([a, b, c,d], [e, f, g,h]) => b - f); //sortez fiecare vector (pentru fiecare an) in ordine crescatoare in functie de sv, pentru a fi ordonate pe axa orizontala
    // }

    for (let i = 0; i < dateFinal.length; i++) {
      const bubbleChart = new BubbleChart(canvasChart);
      //creez cate un grafic pentru fiecare an din vector ce va contine 27 bule pentru 27 tari
      //graficul se redeseneaza la fiecare secunda pentru anul urmator (folosesc setTimeout())
      retineTimeout.push(
        setTimeout(function () {
          bubbleChart.draw(dateFinal[i]);
          context.fillStyle = "black";
          context.font = "17px Arial";
          context.fillText("BubbleChart " + select_ani.options[i].text, 80, 20); //adaug titlul graficului in fuctie de anul de la pozitia curenta, cu dimensiunea de 17px, font Arial, culoare negru
        }, 1000 * i)
      );
    }
    divCanvas.appendChild(canvasChart); //adaug canvas-ul in div-ul divCanvas
    continutBubbleChart.appendChild(divCanvas); //adaug div-ul ce contine canvas-ul la continutBubbleChart
    continutBubbleChart.appendChild(divLegenda); //adaug legenda la continutBubbleChart
    continutBubbleChart.prepend(yLabel); //adaug ca prim element yLabel la continutBubbleChart
    continut.appendChild(xLabel); //adaug xLabel in continut (nu trebuie sa fie pe aceeasi linie cu restul, ci sub grafic)
    continut.prepend(continutBubbleChart); //adaug tot continutul cu cele 3 elemente deasupra xLabel
  });

//CERINTA 6 -  afișare sub formă de tabel a datelor disponibile pentru un an selectat de către utilizator (tarile pe linii și cei trei indicatori pe coloană); fiecare celulă va primi o culoare (de la roșu la verde) în funcție de distanța față de media uniunii

let formular_C6 = document.getElementById("formular-tabel-cerinta-6");
//procedez la fel ca si la celelalte cerinte, imi pun intr-un vector anii, care vor deveni optiunile din select

let ani_selectati6 = document.createElement("select");
formular_C6.prepend(ani_selectati6);

ani_selectati6.setAttribute("id", "select_ani_C6");
ani_selectati6.classList.add("form-select");
ani_selectati6.classList.add("mb-1");

let label_tabelAni = document.createElement("label");
label_tabelAni.htmlFor = "select_ani_C6";
label_tabelAni.innerHTML = "Selectati anul:";
label_tabelAni.classList.add("form-label");
formular_C6.prepend(label_tabelAni);

ani.forEach((element) => {
  let optiune_an = document.createElement("option");
  optiune_an.textContent = element;
  ani_selectati6.appendChild(optiune_an);
  optiune_an.setAttribute("id", "option_ani_C6");
});

function creareCelulaTabel(celula, continut_celula) {
  //functia folosita la popularea celulelor cu valorile indicatorilor
  let continut_paragraf = document.createTextNode(continut_celula); //creez continutul pe care vreau sa il am in celula
  celula.appendChild(continut_paragraf); //adaug continutul in celula
}

let table_container = document.createElement("div"); //div-ul in o sa am tabelul
table_container.id = "table_container";
let tabel = document.createElement("table"); //creez elementul de tip tabel
tabel.setAttribute("id", "table");
tabel.setAttribute("class", "table"); //ii adaug clasa table din bootstrap
tabel.classList.add("table-sm"); //ii adaug clasa table-sm din bootstrap pentru a face tabelul mic
tabel.classList.add("table-bordered"); //ii adaug clasa table-bordered din bootstrap pentru a adauga borduri

document
  .getElementById("button_cerinta_6")
  .addEventListener("click", function () {
    tabel.innerHTML = ""; //golesc tabelul la fiecare click pentru a se popula cu noile date

    let thead = document.createElement("thead"); //creez header-ul tabelului pe care o sa pun numele de coloana
    tabel.appendChild(thead);

    let tbody = document.createElement("tbody"); //creez corpul tabelului
    tabel.appendChild(tbody);

    tari.forEach((element) => {
      let tr = document.createElement("tr"); //pentru fiecare tara din vector creez o linie in tabel
      tbody.appendChild(tr);

      let th = document.createElement("th"); //creez header pentru linii (in care voi avea denumirile tarilor)
      th.textContent = element; //adaug in header-ul de linii (prima coloana) denumirile tarilor
      th.setAttribute("scope", "row"); //aici adaug header-ului scope=row, deci specific ca este header pentru linii
      tr.appendChild(th);
    });

    let sv = []; //in vectorul sv retin toate valorile pentru speranta de viata unde anul elementului din json coincide cu anul selectat de utilizator
    for (let i = 0; i < jsonSV.length; i++) {
      for (let j = 0; j < jsonSV[i].length; j++) {
        if (
          jsonSV[i][j].an ==
          ani_selectati6.options[ani_selectati6.selectedIndex].text
        ) {
          sv.push(jsonSV[i][j].valoare);
        }
      }
    }
    for (let k = 0; k < tabel.rows.length; k++) {
      //pe fiecare linie (nr de linii = nr de elemente din vectorul sv, respectiv 27 (numarul de tari)) creez cate o celula cu noua valoarea a indicatorului SV
      creareCelulaTabel(
        tabel.rows[k].insertCell(tabel.rows[k].cells.length),
        sv[k]
      );
    }

    let arraySV = []; //in acest vector iau toate valorile de pe coloana SV unde valoarea e diferita de null pentru a nu fi aceasta valoarea minima (null reprezinta doar ca nu s-au gasit date, nu ca speranta de viata este nula)
    for (let k = 0; k < tabel.rows.length; k++) {
      if (tabel.rows[k].cells[1].textContent != "null")
        arraySV.push(tabel.rows[k].cells[1].textContent);
    }
    //console.log(arraySV);
    let minSv = Math.min.apply(Math, arraySV); //calculez valoarea minima pentru speranta de viata
    //console.log(minSv);
    let maxSv = Math.max.apply(Math, arraySV); //calculez valoarea maxima pentru speranta de viata
    //console.log(maxSv);

    for (let k = 0; k < tabel.rows.length; k++) {
      //pentru fiecare linie
      tabel.rows[k].cells[1].style.backgroundColor = colorareInScalaDeCulori(
        //colorez celulele din coloana 1 (SV) in functie distanta fata de medie (functia colorareInScalaDeCulori)
        parseFloat(tabel.rows[k].cells[1].textContent),
        minSv,
        maxSv
      );
      if (tabel.rows[k].cells[1].textContent == "null") {
        //cand intalnesc valoarea null, colorez implicit cu rosu
        tabel.rows[k].cells[1].style.backgroundColor = "red";
      }
    }

    let pop = []; //in vectorul pop retin toate valorile pentru populatie unde anul elementului din json coincide cu anul selectat de utilizator
    for (let i = 0; i < jsonPOP.length; i++) {
      for (let j = 0; j < jsonPOP[i].length; j++) {
        if (
          jsonPOP[i][j].an ==
          ani_selectati6.options[ani_selectati6.selectedIndex].text
        ) {
          pop.push(jsonPOP[i][j].valoare);
        }
      }
    }
    for (let k = 0; k < tabel.rows.length; k++) {
      //pe fiecare linie creez cate o celula cu noua valoarea a indicatorului POP
      creareCelulaTabel(
        tabel.rows[k].insertCell(tabel.rows[k].cells.length),
        pop[k]
      );
    }

    let arrayPOP = []; //in acest vector iau toate valorile de pe coloana POP unde valoarea e diferita de null pentru a nu fi aceasta valoarea minima
    for (let k = 0; k < tabel.rows.length; k++) {
      if (tabel.rows[k].cells[2].textContent != "null")
        arrayPOP.push(tabel.rows[k].cells[2].textContent);
    }
    let minPOP = Math.min.apply(Math, arrayPOP);
    //console.log(minPOP);
    let maxPOP = Math.max.apply(Math, arrayPOP);
    //console.log(maxPOP);

    for (let k = 0; k < tabel.rows.length; k++) {
      //pentru fiecare linie
      tabel.rows[k].cells[2].style.backgroundColor = colorareInScalaDeCulori(
        //colorez celulele din coloana 2 (POP) in functie distanta fata de medie (functia colorareInScalaDeCulori)
        parseFloat(tabel.rows[k].cells[2].textContent),
        minPOP,
        maxPOP
      );
      if (tabel.rows[k].cells[2].textContent == "null") {
        //cand intalnesc valoarea null, colorez implicit cu rosu
        tabel.rows[k].cells[2].style.backgroundColor = "red";
      }
    }

    let pib = []; //in vectorul pib retin toate valorile pentru produsul intern brut unde anul elementului din json coincide cu anul selectat de utilizator
    for (let i = 0; i < jsonPIB.length; i++) {
      for (let j = 0; j < jsonPIB[i].length; j++) {
        if (
          jsonPIB[i][j].an ==
          ani_selectati6.options[ani_selectati6.selectedIndex].text
        ) {
          pib.push(jsonPIB[i][j].valoare);
        }
      }
    }
    for (let k = 0; k < tabel.rows.length; k++) {
      //pe fiecare linie creez cate o celula cu noua valoarea a indicatorului PIB
      creareCelulaTabel(
        tabel.rows[k].insertCell(tabel.rows[k].cells.length),
        pib[k]
      );
    }

    let arrayPIB = []; //in acest vector iau toate valorile de pe coloana PIB unde valoarea e diferita de null pentru a nu fi aceasta valoarea minima
    for (let k = 0; k < tabel.rows.length; k++) {
      if (tabel.rows[k].cells[3].textContent != "null")
        arrayPIB.push(tabel.rows[k].cells[3].textContent);
    }
    //console.log(arrayPIB);
    let minPIB = Math.min.apply(Math, arrayPIB);
    //console.log(minPIB);
    let maxPIB = Math.max.apply(Math, arrayPIB);
    //console.log(maxPIB);

    for (let k = 0; k < tabel.rows.length; k++) {
      //pentru fiecare linie
      tabel.rows[k].cells[3].style.backgroundColor = colorareInScalaDeCulori(
        //colorez celulele din coloana 3 (PIB) in functie distanta fata de medie (functia colorareInScalaDeCulori)
        parseFloat(tabel.rows[k].cells[3].textContent),
        minPIB,
        maxPIB
      );
      if (tabel.rows[k].cells[3].textContent == "null") {
        //cand intalnesc valoarea null, colorez implicit cu rosu
        tabel.rows[k].cells[3].style.backgroundColor = "red";
      }
    }

    let row = thead.insertRow(0); //inserez in header linia ce contine denumirile coloanlor
    let tara = row.insertCell(0); //tara o inserez pe pozitia 0
    let svCELL = row.insertCell(1); //sv o inserez pe pozitia 1
    let popCELL = row.insertCell(2); //pop o inserez pe pozitia 2
    let pibCELL = row.insertCell(3); //pib il inserez pe pozitia 3

    //fiecare celula din prima linie va fi un element de tipul th
    tara.outerHTML = "<th>Tara</th>";
    svCELL.outerHTML = "<th>" + indicatori[0] + "</th>";
    popCELL.outerHTML = "<th>" + indicatori[1] + "</th>";
    pibCELL.outerHTML = "<th>" + indicatori[2] + "</th>";

    continut.innerHTML = ""; //golesc continutul curent
    continut.appendChild(table_container); //adaug div-ul ce contine tabelul in continut
    table_container.appendChild(tabel); //adaug tabelul in div
    const descriereTabel = document.createElement("p"); //creez un paragraf pe care il voi adauga ca prim element in continut ce va contine descrierea tabelului
    descriereTabel.innerHTML =
      "&emsp;Tabelul urmator prezinta informatii cu privire speranta de viata, populatia si produsul intern brut pentru tarile Uniunii Europene la nivelul anului selectat. Celulele din fiecare coloana sunt colorate diferit in functie de distanta fata de media Uniunii Europene pentru acel indicator, scala de culoare fiind de la rosu (cea mai indepartata valoare de medie, mai mica decat aceasta) la verde (cea mai indepartata valoare de medie, mai mare decat aceasta).";
    continut.prepend(descriereTabel);
  });

function buton_Despre() {
  //functia care imi populeaza continutul cu descrierea aplicatiei
  continut.innerHTML = ""; //golesc continutul
  const div_despre = document.createElement("div"); //creez un element div
  div_despre.id = "div_despre";
  continut.appendChild(div_despre); //adaug div-ul la continut

  const titlu_despre = document.createElement("h4"); //acesta va reprezenta "titlul" continutului generat pe butonul Despre aplicatie
  div_despre.appendChild(titlu_despre); //adaug titlul in div
  titlu_despre.innerHTML = "Descrierea aplicației"; //textul continut de div

  const paragraf = document.createElement("p"); //creez un element de tip paragraf
  div_despre.appendChild(paragraf); //pe care il adaug in div
  paragraf.innerHTML = //continutul paragrafului
    "&emsp;Prezenta aplicație are ca scop reprezentarea vizuală a unui set de date ce conține informații referitoare la țările Uniunii Europene pentru anii 2000-2018, despre indicatorii:";

  const ul = document.createElement("ul"); //creez o lista neordonata in care o sa specific indicatorii folositi in aplicatie
  div_despre.appendChild(ul); //adaug lista in div
  //fiecare indicator va reprezenta un item in lista
  const li1 = document.createElement("li");
  li1.innerHTML =
    "speranță de viață, ce se va regăsi în aplicație sub notația SV;";
  const li2 = document.createElement("li");
  li2.innerHTML =
    "produs intern brut, ce se va regăsi în aplicație sub notația PIB;";
  const li3 = document.createElement("li");
  li3.innerHTML = "populație, ce se va regăsi în aplicație sub notația POP.";
  //adaug item-urile in lista
  ul.appendChild(li1);
  ul.appendChild(li2);
  ul.appendChild(li3);

  //elementele de tip h6 vor fi folosite pentru numele optiunilor pe care aplicatia le ofera
  //creez paragrafe pentru fiecare optiune care vor contine ca si text descrierea optiunii respective

  const hAfisareBarChart = document.createElement("h6");
  div_despre.appendChild(hAfisareBarChart);
  hAfisareBarChart.innerHTML = "Afișare BarChart";

  const paragrafAfisareBarChart = document.createElement("p");
  div_despre.appendChild(paragrafAfisareBarChart);
  paragrafAfisareBarChart.innerHTML =
    "&emsp;Prima opțiune este aceea de a afișa evoluția pe ani pentru o țară și un indicator selectate. După ce s-a selectat țara și indicatorul dorit, prin apăsarea butonului „Afisare BarChart”, se va genera graficul. Pe axa Ox sunt reprezentați ani, iar pe axa Oy valorile indicatorului selectat. Atât anul, cât și valoarea indicatorului sunt vizibile prin poziționarea cursorului pe o bară din grafic. Barele sunt colorate diferit, de la roșu la verde, în funcție de media indicatorului selectat pentru toți anii, roșu reprezentând valoarea cea mai îndepărtată, dar mai mică decât media, galben valoarea mediei, iar verde valoarea cea mai îndepărtată, dar mai mare decât media";

  const hAfisareBubbleChart = document.createElement("h6");
  div_despre.appendChild(hAfisareBubbleChart);
  hAfisareBubbleChart.innerHTML = "Afișare BubbleChart";

  const paragrafAfisareBubbleChart = document.createElement("p");
  div_despre.appendChild(paragrafAfisareBubbleChart);
  paragrafAfisareBubbleChart.innerHTML =
    "&emsp;A doua opțiune permite vizualizarea unui grafic cu bule pentru un an selectat de dumneavoastră. La apăsarea butonului „Afisare BubbleChart” se generează graficul unde o bulă reprezintă o țară, pe axa Ox având valorile pentru produsul intern brut, pe axa Oy valorile pentru populație, iar raza fiecărei bule este dată de valoarea speranței de viață. Bulele sunt colorate diferit, de la roșu la verde, în funcție de media Uniunii Europene pentru anul selectat, pentru speranța de viață, roșu reprezentând valoarea cea mai îndepărtată, dar mai mică decât media, galben valoarea mediei, iar verde valoarea cea mai îndepărtată, dar mai mare decât media";

  const hAnimatieBubbleChart = document.createElement("h6");
  div_despre.appendChild(hAnimatieBubbleChart);
  hAnimatieBubbleChart.innerHTML = "Animație BubbleChart";

  const paragrafAnimatieBubbleChart = document.createElement("p");
  div_despre.appendChild(paragrafAnimatieBubbleChart);
  paragrafAnimatieBubbleChart.innerHTML =
    "&emsp;Cea de-a treia opțiune reprezintă o animație de grafice cu bule pentru toți anii din setul nostru de date. Prin apăsarea butonulul „Animatie BubbleChart” se va genera graficul care se va reface la fiecare secunda cu valorile următorului an. O bulă reprezintă o țară, pe axa Ox având valorile pentru produsul intern brut, pe axa Oy valorile pentru populație, iar raza fiecărei bule este dată de valoarea speranței de viață. Bulele sunt colorate diferit, de la roșu la verde, în funcție de media Uniunii Europene pentru anul afisat, pentru speranța de viață, roșu reprezentând valoarea cea mai îndepărtată, dar mai mică decât media, galben valoarea mediei, iar verde valoarea cea mai îndepărtată, dar mai mare decât media";

  const hAfisareTabel = document.createElement("h6");
  div_despre.appendChild(hAfisareTabel);
  hAfisareTabel.innerHTML = "Afișare tabel";

  const paragrafAfisareTabel = document.createElement("p");
  div_despre.appendChild(paragrafAfisareTabel);
  paragrafAfisareTabel.innerHTML =
    "&emsp;Ultima opțiune permite ca la selectarea unui an, acțiune urmată de apăsarea butonul „Afisare tabel” să se genereze un tabel care conține pe linii tările, iar pe coloane cei trei indicatorii, fiecare celulă din tabel fiind colorată diferit în funție de valoarea din celulă, raportată la media Uniunii Europene pentru acel indicator. Scala de culoare este de la roșu la verde, valorile cele mai îndepărtate de medie, dar mai mici decât aceasta fiind reprezentate în tonuri de roșu, valorile cele mai apropiate de medie în tonuri de galben, iar valorile cele mai îndepărtate de medie, dar mai mari decât aceasta, în tonuri de verde.";
}

document.getElementById("despre-button").addEventListener("click", function () {
  //la fiecare apasare a butonului Despre aplicatie se va apela functia buton_Despre care imi populeaza continutul cu descrierea aplicatiei
  buton_Despre();
});

window.addEventListener("load", function () {
  //la incarcarea aplicatiei, implicit, in continut va aparea sectiunea Descrierea aplicatiei care poate fi revazuta si la apasarea butonului Despre aplicatie
  buton_Despre();
});
