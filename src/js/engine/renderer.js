export default class Renderer {
  constructor(context2D) {
    this.context = context2D;
    this.renderProperties = {};
  }

  clear = () => {
    this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);
  };

  renderBackground = () => {
    this.context.fillStyle = "rgba(0, 0, 0, 1)";
    this.context.fillRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight);
    this.context.fill();
  };

  render = renderables => {
    this.clear();
    this.renderBackground();

    renderables.map(renderable => {
      this.renderProperties = renderable.render();
      if (this.renderProperties.type === 'sprite') {
        this.context.drawImage(...this.renderProperties.attributes);
      }
    }, this);
  };
};
