package main

import (
	"context"
	"fmt"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/ec2/types"
	"log"
	"net/http"
)

func GPUVm() (bool, string) {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion("us-west-2"))
	if err != nil {
		fmt.Println(err.Error())
		return false, ""
	}

	tagName := "tag:demo-gpu-vm"
	input := &ec2.DescribeInstancesInput{
		Filters: []types.Filter{
			{
				Name:   &tagName,
				Values: []string{"true"},
			},
		},
	}

	client := ec2.NewFromConfig(cfg)

	result, err := client.DescribeInstances(context.TODO(), input)
	if err != nil {
		fmt.Println(err.Error())
		return false, ""
	}

	if len(result.Reservations) == 0 {
		return false, ""
	}

	if len(result.Reservations[0].Instances) == 0 {
		return false, ""
	}

	return result.Reservations[0].Instances[0].State.Name == "running", *result.Reservations[0].Instances[0].PrivateIpAddress

	// fmt.Printf("%+v\n", result.Reservations[1].Instances[0].State.Name)
}

func main() {
	handler := func() func(http.ResponseWriter, *http.Request) {
		return func(w http.ResponseWriter, r *http.Request) {
			isUp, privateIp := GPUVm()
			if isUp {
				http.Redirect(w, r, fmt.Sprintf("http://%s", privateIp), http.StatusSeeOther)
			} else {
				http.FileServer(http.Dir("./out")).ServeHTTP(w, r)
			}
		}
	}

	const portNum string = "0.0.0.0:8080"
	log.Println("Started on ", portNum)
	fmt.Println("To close connection CTRL+C :-)")
	http.HandleFunc("/", handler())
	err := http.ListenAndServe(portNum, nil)
	if err != nil {
		panic(err)
	}
}
