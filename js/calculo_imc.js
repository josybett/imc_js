//fórmula: peso (kg) / [estatura (m)]2
// Cálculo de Índice de Masa Muscular

function calculo_imprimir(persona) {
    let imc = persona.calculo_imc();
    if (imc != false) {
        persona.imc = imc;
    }
    return persona;
}

function interpretar_imc_old(imc) {
    let recomendacion = new RecomendacionesIMC();
    if (imc < 18.5) {
        recomendacion.resultado = "Bajo peso";
        recomendacion.indicacion = "Aumenta la ingesta de proteína, frutas y vegetales";
    } else if (imc >= 18.5 && imc < 25) {
        recomendacion.resultado = "Peso Normal";
        recomendacion.indicacion = "No olvides la actividad física";
    } else if (imc >= 25 && imc < 30) {
        recomendacion.resultado = "Sobrepeso";
        recomendacion.indicacion = "Prioriza la actividad física y reduce los carbohidratos";
    } else {
        recomendacion.resultado = "Obesidad";
        recomendacion.indicacion = "Cuida de no comer grasas y muy pocos carbohidratos de cerelaes. Haz ejercicio a diario";
    }
    return recomendacion;
}

function interpretar_imc(imc) {
    return new Promise((resolve) => {
        fetch("data/recomendaciones.json")
        .then( response => response.json() )
        .then( data => {
            resolve (data.find( (d) => { return imc >= d.min_imc && imc < d.max_imc }));
        });
    });
}


const form_calcular = document.getElementById("form_calcular");
const inp_edad = document.getElementById("inp_edad");
const inp_peso = document.getElementById("inp_peso");
const inp_estatura = document.getElementById("inp_estatura");
const inp_buscar_persona = document.getElementById("inp_buscar_persona");
const btn_buscar_persona = document.getElementById("btn_buscar_persona");
const div_resultado = document.getElementById("resultado");
const div_lista_filtro = document.getElementById("lista_filtro");

let error_inputs = false;
let nombre_usuario = "";

function validacion_numerica({target}) {
    const {value, name} = target;
    if (parseInt(value) && parseInt(value) > 0 && !value.includes("e")) {
        switch (name) {
            case "edad":
                document.getElementById("span_edad").innerHTML = '';
                error_inputs = false;
                break;
            case "peso":
                document.getElementsByName("span_peso").innerHTML = '';
                error_inputs = false;
                break;
            case "estatura":
                document.getElementsByName("span_estatura").innerHTML = '';
                error_inputs = false;
                break;
            default:
                break;
        }
        return;
    }
    const text_error = 'Sólo valores numéricos positivos';
    switch (name) {
        case "edad":
            document.getElementById("span_edad").innerHTML = text_error + ' enteros';
            error_inputs = true;
            break;
        case "peso":
            document.getElementById("span_peso").innerHTML = text_error + ' decimal con punto';
            error_inputs = true;
            break;
        case "estatura":
            document.getElementById("span_estatura").innerHTML = text_error + ' decimal con punto';
            error_inputs = true;
            break;
        default:
            break;
    }
}

function btn_calcular_imc(event) {
    event.preventDefault();
    if (!error_inputs) {
        const nombre = document.getElementById("inp_nombre").value;
        const edad = inp_edad.value;
        const peso = inp_peso.value;
        const estatura = inp_estatura.value;

        let persona = new IMC(nombre.trim().toUpperCase(), parseInt(edad), parseFloat(peso), parseFloat(estatura));
        let imc = calculo_imprimir(persona);
        Toastify({
            text: "Registro exitoso! "+ imc.nombre +", el resultado del cálculo de IMC es: "+ imc.imc +". Para más información, filtra por tu nombre",
            className: "info",
            duration: 10000,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();

        let dataStorage = JSON.parse(localStorage.getItem("arr_personas") || '[]');
        let arreglo_JSON = JSON.stringify([...dataStorage, imc]);
        localStorage.setItem("arr_personas" , arreglo_JSON);
        document.getElementById("inp_nombre").value = "";
        inp_edad.value = "";
        inp_peso.value = "";
        inp_estatura.value = "";
    }
}

function filtro_person_nombre(obj_imc) {
    return obj_imc.nombre == nombre_usuario.toUpperCase();
}

async function buscar_persona() {
    let arr = localStorage.getItem("arr_personas");
    nombre_usuario = inp_buscar_persona.value;
    arr = JSON.parse(arr);
    let arr_filter = nombre_usuario == "" ? arr : arr.filter(filtro_person_nombre);

    div_lista_filtro.innerHTML = "";

    for( let person of arr_filter ){
        let { nombre, edad, peso, estatura, imc } = person;
        let { resultado, indicacion } = await interpretar_imc(imc);
        let lista = document.createElement("ul");
        lista.classList.add("list-group", "list-group-horizontal");
        lista.innerHTML = `<li class="list-group-item">${nombre}</li>
                        <li class="list-group-item">Edad ${edad} años</li>
                        <li class="list-group-item">Peso ${peso} kg</li>
                        <li class="list-group-item">Estatura ${estatura} m</li>
                        <li class="list-group-item">IMC ${imc} - ${resultado}</li>
                        <li class="list-group-item">Recomendaciones: ${indicacion}</li>`;
        div_lista_filtro.append(lista);
    }
}


inp_edad.addEventListener("change", validacion_numerica);
inp_peso.addEventListener("change", validacion_numerica);
inp_estatura.addEventListener("change", validacion_numerica);
form_calcular.addEventListener("submit", btn_calcular_imc);
btn_buscar_persona.addEventListener("click", buscar_persona);