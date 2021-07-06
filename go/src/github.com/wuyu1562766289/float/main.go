package main

import (
	"fmt"
)

func main() {
	// math.MaxFloat32	// float32最大值
	f1 := 1.23456
	fmt.Printf("%T\n", f1) // go语言中小数默认都是float64类型
	f2 := float32(1.23456)
	fmt.Printf("%T\n", f2) // float32
	// f1 = f2 // float32类型的值不能直接赋值给float64类型的变量
}
