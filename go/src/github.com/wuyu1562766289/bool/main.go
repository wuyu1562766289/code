package main

import "fmt"

func main() {
	b1 := true
	var b2 bool // 默认为false
	fmt.Printf("%T\n", b1)
	fmt.Printf("%T value: %v\n", b2, b2)
}
