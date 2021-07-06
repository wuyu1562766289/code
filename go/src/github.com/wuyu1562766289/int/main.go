package main

import "fmt"

// 整型
func main() {
	var i1 = 101
	fmt.Printf("%d\n", i1) // 101
	fmt.Printf("%b\n", i1) // 转换为二进制
	fmt.Printf("%o\n", i1) // 转换为八进制
	fmt.Printf("%x\n", i1) // 转换为十六进制

	// 八进制
	i2 := 077
	fmt.Printf("%d\n", i2) // 63

	// 十六进制
	i3 := 0x123456
	fmt.Printf("%d\n", i3)

	// 查看变量类型
	fmt.Printf("%T\n", i3)

	// 声明int8类型的变量
	i4 := int8(9) // 明确指定int8类型，否则就是默认为int类型
	fmt.Printf("%T\n", i4)
}
