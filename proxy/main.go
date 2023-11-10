package main

import(
		"log"
		"fmt"
		"strings"
		"context"
        "net/url"
        "net/http"
        "net/http/httputil"
		"github.com/aws/aws-sdk-go-v2/config"
		"github.com/aws/aws-sdk-go-v2/service/ec2"
		"github.com/aws/aws-sdk-go-v2/service/ec2/types"
)

func isGPUVmDown() bool {
	cfg, err := config.LoadDefaultConfig(context.TODO())
		if err != nil {
		log.Fatal(err)
	}

	tagName := "tag:demo-gpu-vm"
	input := &ec2.DescribeInstancesInput{
		Filters: []types.Filter { 
			{
				Name: &tagName,
				Values: []string {"true"},
			},
		},
	}
	
	client := ec2.NewFromConfig(cfg)

	result, err := client.DescribeInstances(context.TODO(), input)
	if err != nil {
		fmt.Println(err.Error())
		return true
	}

	if len(result.Reservations) == 0 {
		return true
	}

	if len(result.Reservations[0].Instances) == 0 {
		return true
	}

	return result.Reservations[0].Instances[0].State.Name != "running"
	
	// fmt.Printf("%+v\n", result.Reservations[1].Instances[0].State.Name)
}

func main() {
        remote, err := url.Parse("http://localhost:3000")
        if err != nil {
                panic(err)
        }

        handler := func(p *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
                return func(w http.ResponseWriter, r *http.Request) {
                        r.Host = remote.Host
						if isGPUVmDown() {
							if !strings.HasPrefix(r.URL.Path, "/_next") {
								r.URL.Path = "/down"
							}
						}
                        p.ServeHTTP(w, r)
                }
        }

        const portNum string = ":8080"
        proxy := httputil.NewSingleHostReverseProxy(remote)
		log.Println("Started on port", portNum)
    	fmt.Println("To close connection CTRL+C :-)")
        http.HandleFunc("/", handler(proxy))
        err = http.ListenAndServe(portNum, nil)
        if err != nil {
            panic(err)
        }
}
