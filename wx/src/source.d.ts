// 优化编译器提示，声明静态资源文件
declare module '*.png' {
  const src: string;
  export default src;
}