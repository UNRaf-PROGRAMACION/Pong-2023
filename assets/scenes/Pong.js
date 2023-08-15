// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Pong extends Phaser.Scene {
  //atributo privado
  //#vidas

  //atributo publico
  cursor;

  nivel;
  puntaje;
  velocidadPelota;
  velocidadPaleta;
  obstaculos;
  colorFondo;

  paleta;
  pelota;

  estaVivo;

  constructor() {
    super("Pong");
  }
  init(data) {
    //inicializar atributos
    this.nivel = data.nivel || 1;
    this.puntaje = data.puntaje || 0;
    this.velocidadPelota = data.velocidadPelota || 200;
    this.velocidadPaleta = data.velocidadPaleta || 300;
    this.obstaculos = data.obstaculos || [];
    this.colorFondo = data.colorFondo || "#000000";
    this.estaVivo = data.estaVivo || true;
  }

  preload() {
    //cargar recursos
  }

  create() {
    //crear cursor
    this.cursor = this.input.keyboard.createCursorKeys();

    //crear paleta
    this.paleta = this.add.rectangle(400, 500, 200, 20, 0xffffff);
    this.physics.add.existing(this.paleta);
    this.paleta.body.setImmovable(true);
    this.paleta.body.allowGravity = false;

    //crear pelota
    this.pelota = this.add.circle(400, 400, 10, 0xffffff);
    this.physics.add.existing(this.pelota);
    this.pelota.body.setBounce(1, 1);
    this.pelota.body.setVelocity(this.velocidadPelota, this.velocidadPelota);

    //colision con la paleta
    this.physics.add.collider(
      this.pelota,
      this.paleta,
      this.sumarPunto,
      null,
      this
    );

    //colision con los obstaculos
    this.obstaculos.forEach((obstaculo) => {
      const item = this.add.rectangle(
        obstaculo.x,
        obstaculo.y,
        obstaculo.ancho,
        obstaculo.alto,
        0xffffff
      );
      this.physics.add.existing(item);
      item.body.setImmovable(true);
      this.physics.add.collider(this.pelota, item);
    });

    //colision con los bordes
    this.pelota.body.setCollideWorldBounds(true);
    //colision con los bordes
    this.physics.world.on("worldbounds", (body, up, down, left, right) => {
      if (down) {
        console.log("perdiste");
        this.estaVivo = false;
        this.scene.start("Pong", {
          nivel: this.nivel,
          puntaje: this.puntaje,
          velocidadPelota: this.velocidadPelota,
          velocidadPaleta: this.velocidadPaleta,
          obstaculos: this.obstaculos,
          colorFondo: this.colorFondo,
          estaVivo: this.estaVivo,
        });
      }
    });

    //agregar texto en pantalla
    this.add.text(10, 10, `Nivel: ${this.nivel}`, {
      fontSize: 20,
      color: "#ffffff",
    });
    this.textoPuntaje = this.add.text(10, 40, `Puntaje: ${this.puntaje}`, {
      fontSize: 20,
      color: "#ffffff",
    });
  }

  update() {
    //mover paleta izquierda y derecha. Se usa el teclado
    this.paleta.body.setVelocityX(0);

    if (this.cursor.left.isDown) {
      this.paleta.body.setVelocityX(-this.velocidadPaleta);
    }
    if (this.cursor.right.isDown) {
      this.paleta.body.setVelocityX(this.velocidadPaleta);
    }
  }

  sumarPunto(pelota, paleta) {
    this.puntaje++;
    this.textoPuntaje.setText(`Puntaje: ${this.puntaje}`);

    if (this.puntaje == 3) {
      this.pasarNivel();
    }
  }

  pasarNivel() {
    this.nivel++;
    this.puntaje = 0;
    this.velocidadPelota *= 1.1;
    this.velocidadPaleta += 50;
    this.obstaculos.push({
      x: Phaser.Math.Between(100, 700),
      y: Phaser.Math.Between(0, 400),
      ancho: Phaser.Math.Between(50, 100),
      alto: Phaser.Math.Between(20, 40),
    });

    this.scene.start("Pong", {
      nivel: this.nivel,
      puntaje: this.puntaje,
      velocidadPelota: this.velocidadPelota,
      velocidadPaleta: this.velocidadPaleta,
      obstaculos: this.obstaculos,
      colorFondo: this.colorFondo,
      estaVivo: this.estaVivo,
    });
  }
}
