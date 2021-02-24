import React, { Component } from "react";
import style from "./inici.css";

class Inici extends Component {
  state = {};

  componentDidMount() {}

  render() {
    return (
        <div id="contenedor">
          <div id="pic1">
            <img
              id="img1"
              src="http://vignette1.wikia.nocookie.net/pokemon/images/9/96/004Charmander_OS_anime.png/revision/latest?cb=20140603214902"
              onmouseover="this.style.opacity=1;"
              onmouseout="this.style.opacity=0.5;"
            />
            <p>Charmander</p>
            <div class="destacado">
              ATK: <progress value="50" max="100"></progress>
              DEF: <progress value="36" max="100"></progress>
            </div>
          </div>

          <div id="pic2">
            <img
              id="img1"
              src="http://vignette1.wikia.nocookie.net/pokemon/images/b/b8/001Bulbasaur_Dream.png/revision/latest?cb=20140903033758"
              onmouseover="this.style.opacity=1;"
              onmouseout="this.style.opacity=0.5;"
            />
            <p>Bulbasaur</p>
            <div class="destacado">
              ATK: <progress value="40" max="100"></progress>
              <br />
              <br />
              DEF: <progress value="86" max="100"></progress>
            </div>
          </div>

          <div id="pic2">
            <img
              id="img1"
              src="http://vignette1.wikia.nocookie.net/pokemon/images/b/b8/001Bulbasaur_Dream.png/revision/latest?cb=20140903033758"
              onmouseover="this.style.opacity=1;"
              onmouseout="this.style.opacity=0.5;"
            />
            <p>Bulbasaur</p>
            <div class="destacado">
              ATK: <progress value="40" max="100"></progress>
              <br />
              <br />
              DEF: <progress value="86" max="100"></progress>
            </div>
          </div>

        </div>
    );
  }
}

export default Inici;
