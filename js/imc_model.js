class IMC {

    constructor (nombre, edad, peso, estatura) {
        this.nombre = nombre;
        this.edad = edad;
        this.peso = peso;
        this.estatura = estatura;
        this.imc = 0;
    }

    // METODOS
    validar_datos() {
        return (!isNaN(this.peso) && !isNaN(this.estatura));
    }

    calculo_imc() {
        let validar = !this.validar_datos() ? false : Math.round(this.peso / (this.estatura * this.estatura));
        return validar;
    }
}