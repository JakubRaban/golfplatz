export const graphStyle = [
  {
    selector: 'node',
    style: {
      'width': 30,
      'height': 30,
      'background-fill': 'radial-gradient',
      'background-gradient-stop-colors': '#142E52 #000000 #ffffff',
      'background-gradient-stop-positions': '0% 70% 100%',
      'min-zoomed-font-size': 10,
      'font-size': 10,
      'color': '#444',
    },
  },
  {
    selector: 'node[label]',
    style: {
      'content': 'data(label)',
    },
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 2,
      'border-color': '#17a2b8',
    },
  },
  {
    selector: 'edge',
    style: {
      'width': 3,
      'curve-style': 'bezier',
      'target-arrow-shape': 'triangle',
      'color': '#0000ff',
      'font-size': 8,
      'edge-distances': 'node-position',
      'text-background-color': '#fff',
      'text-background-opacity': 1,
    },
  },
  {
    selector: '.eh-handle',
    style: {
      'background-color': 'red',
      'width': 12,
      'height': 12,
      'shape': 'ellipse',
      'overlay-opacity': 0,
      'border-width': 15,
      'border-opacity': 0,
    },
  },

  {
    selector: '.eh-hover',
    style: {
      'background-color': 'red',
    },
  },

  {
    selector: '.eh-source',
    style: {
      'border-width': 2,
      'border-color': 'red',
    },
  },

  {
    selector: '.eh-target',
    style: {
      'border-width': 2,
      'border-color': 'red',
    },
  },

  {
    selector: '.eh-preview, .eh-ghost-edge',
    style: {
      'background-color': 'red',
      'line-color': 'red',
      'target-arrow-color': 'red',
      'source-arrow-color': 'red',
    },
  },

  {
    selector: '.eh-ghost-edge.eh-preview-active',
    style: {
      'opacity': 0,
    },
  },
];

export default graphStyle;
