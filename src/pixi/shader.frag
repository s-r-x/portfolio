uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D disp;
varying vec2 vTextureCoord;
uniform float dispFactor;
uniform float effectFactor;
uniform float isNext;

void main() {
  vec4 disp = texture2D(disp, vTextureCoord);

  vec2 distortedPosition; 
  vec2 distortedPosition2;
  if(isNext == 1.0) {
    distortedPosition = vec2(vTextureCoord.x + dispFactor * (disp.r*effectFactor), vTextureCoord.y);
    distortedPosition2 = vec2(vTextureCoord.x - (1.0 - dispFactor) * (disp.r*effectFactor), vTextureCoord.y);
  }
  else {
    distortedPosition = vec2(vTextureCoord.x - dispFactor * (disp.r*effectFactor), vTextureCoord.y);
    distortedPosition2 = vec2(vTextureCoord.x + (1.0 - dispFactor) * (disp.r*effectFactor), vTextureCoord.y);
  }

  vec4 _texture = texture2D(texture1, distortedPosition);
  vec4 _texture2 = texture2D(texture2, distortedPosition2);

  vec4 finalTexture = mix(_texture, _texture2, dispFactor);

  gl_FragColor = finalTexture;
}
