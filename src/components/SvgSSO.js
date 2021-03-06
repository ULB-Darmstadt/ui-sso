const SvgSSO = ({ width, height, colorStart, colorEnd }) => 
  <svg height={height} width={width} xmlns="http://www.w3.org/2000/svg"
    version="1.1" x="0px" y="0px" viewBox={`0 0 90 56.57`} >
    
      <defs>
        <linearGradient id="IconGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colorStart} />
          <stop offset="100%" stopColor={colorEnd} />
        </linearGradient>
      </defs>
      
      <g fill="url(#IconGradient)" transform="matrix(0.49350057,-0.12467006,0.12467006,0.49350057,-103.63312,-453.91818)">
        <path stroke="none" marker="none" visibility="visible" display="inline" overflow="visible" d="m 25,980.36218 c 8.5479,0 15.9516,4.8785 19.5938,12 H 87 l 10,8.56252 -14,11.4375 -6,-6 -6,6 -6,-6 -6,6 H 44.5938 c -3.6422,7.1215 -11.0459,12 -19.5938,12 -12.1502,0 -22,-9.8498 -22,-22 0,-12.15022 9.8498,-22.00002 22,-22.00002 z m -7,16 c -3.3137,0 -6,2.6863 -6,6.00002 0,3.3137 2.6863,6 6,6 3.3137,0 6,-2.6863 6,-6 0,-3.31372 -2.6863,-6.00002 -6,-6.00002 z" />
      </g>
      
      <g fill="url(#IconGradient)" transform="translate(240.2381,-12.108558)">
        <path d="m -188.1671,14.680558 c 11.697,0 21.215,9.518 21.215,21.214 0,0.089 -0.008,0.177 -0.016,0.264 -0.01,0.138 -0.018,0.279 -0.022,0.417 l -0.075,2.362 2.346,0.275 c 6.79,0.797 11.91,6.558 11.91,13.397 0,7.444 -6.057,13.5 -13.5,13.5 -0.073,0 -0.146,-0.008 -0.219,-0.013 -0.105,-0.006 -0.213,-0.014 -0.318,-0.016 l -2.678,-0.077 v 0.105 h -54.123 l -0.88,-0.097 c -7.49,-0.83 -13.14,-7.145 -13.14,-14.689 0,-6.246 3.967,-11.845 9.87,-13.93 l 1.671,-0.59 0.044,-1.772 c 0.118,-4.923 4.066,-8.78 8.986,-8.78 2.057,0 3.995,0.682 5.61,1.972 l 2.597,2.077 1.355,-3.038 c 3.415,-7.64 11.017,-12.581 19.367,-12.581 m 0,-2.572 c -9.686,0 -18.002,5.799 -21.714,14.106 -1.979,-1.583 -4.485,-2.535 -7.215,-2.535 -6.295,0 -11.405,5.03 -11.558,11.289 -6.742,2.384 -11.584,8.795 -11.584,16.355 0,8.933 6.751,16.284 15.429,17.244 v 0.113 h 57.857 v -0.031 c 0.214,0.007 0.424,0.031 0.643,0.031 8.877,0 16.071,-7.196 16.071,-16.072 0,-8.234 -6.197,-15.014 -14.182,-15.95 0.009,-0.256 0.039,-0.507 0.039,-0.765 0,-13.135 -10.65,-23.785 -23.786,-23.785" />
      </g>
 </svg>;

export default SvgSSO;