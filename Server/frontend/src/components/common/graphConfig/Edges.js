export const edgesConfig = {
  preview: true,
  hoverDelay: 150,
  handleNodes: 'node',
  snap: false,
  snapThreshold: 50,
  snapFrequency: 15,
  noEdgeEventsInDraw: false,
  disableBrowserGestures: true,
  data: { label: '' },
  handlePosition(node) {
    return 'middle top';
  },
  handleInDrawMode: false,
  edgeType(sourceNode, targetNode) {
    return 'flat';
  },
  loopAllowed(node) {
    return false;
  },
  nodeLoopOffset: -50,
  nodeParams(sourceNode, targetNode) {
    return {};
  },
  edgeParams(sourceNode, targetNode, i) {
    return {};
  },
  ghostEdgeParams() {
    return {};
  },
  show(sourceNode) { },
  hide(sourceNode) { },
  start(sourceNode) { },
  complete(sourceNode, targetNode, addedEles) { },
  stop(sourceNode) { },
  cancel(sourceNode, cancelledTargets) { },
  hoverover(sourceNode, targetNode) { },
  hoverout(sourceNode, targetNode) { },
  previewon(sourceNode, targetNode, previewEles) { },
  previewoff(sourceNode, targetNode, previewEles) { },
  drawon() { },
  drawoff() { },
};
export default edgesConfig;
  
