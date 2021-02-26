title: Spark on K8S
date: 2021-02-26 11:33:29
tags:[spark, kubernetes]
---

在将 Spark 部署到 K8S 集群中遇到了不少问题，因此记录下来，帮助自己回顾，也帮助大家少踩坑。

<!-- more -->

## Docker 镜像

在[官网下载 Saprk](https://spark.apache.org/downloads.html) 后，可在 ` kubernetes/dockerfiles/ ` 目录中找到 Dockerfile 文件，同时，可以使用 `bin/docker-image-tool.sh `脚本编译和推送 Docker 镜像。

注意：此处的镜像地址需要使用公开的地址，私有地址在 `spark-submit` 时无法拉取。

例如：

```bash
$ ./bin/docker-image-tool.sh -r registry.cn-shanghai.aliyuncs.com/your-repository -t my-tag build
$ ./bin/docker-image-tool.sh -r registry.cn-shanghai.aliyuncs.com/your-repository -t my-tag push
```

## 打包成 jar 包

将 Scala 项目打包成 jar 包时不会将项目依赖一同打包，所以在此需要用到 [sbt-assembly](https://github.com/sbt/sbt-assembly) 插件，使用时可添加以下代码解决依赖冲突问题

```scala
assemblyMergeStrategy in assembly := {
  case PathList("META-INF", xs @ _*) => MergeStrategy.discard
  case x => MergeStrategy.first
}
```


## 提交任务

将 jar 包提交到 K8S 集群，jar 包需上传至 K8S 集群可访问的公开地址，例如 OSS 或者网盘等。**提交前需[配置 RBAC](https://spark.apache.org/docs/latest/running-on-kubernetes.html#rbac)**，更多参数设置可参考 [Spark on Kubernetes configurations](https://spark.apache.org/docs/latest/running-on-kubernetes.html#configuration)。

```bash
spark-submit \
    --master k8s://https://your-k8s-address:8443/k8s/clusters/c-97rck \
    --deploy-mode cluster \
    --name project-name \
    --class "main" \
    --conf spark.executor.instances=1 \
    --conf spark.driver.host=${SPARK_LOCAL_IP} \
    --conf spark.driver.memory=3g \
    --conf spark.executor.memory=3g \
    --driver-cores 500m \
    --conf spark.kubernetes.driverEnv.SCALA_ENV=production \
    --conf spark.kubernetes.authenticate.driver.serviceAccountName=spark \
    --conf spark.kubernetes.driver.pod.name=project-name \
    --conf spark.kubernetes.container.image=registry-vpc.cn-shanghai.aliyuncs.com/your-repository/spark:2.3.0 \
    http://example.com/kafka-assembly-1.0.jar
```

## 访问 Spark Driver UI

我们可以在本地使用kubectl port-forward访问Driver UI：

```bash
$ kubectl port-forward spark-kubernetes-driver 4040:4040
```
执行完后通过http://localhost:4040访问。

## 实践中遇到的错误

```bash
Error: Could not find or load main class
```

需要在 `build.sbt` 中指定 `mainClass`，例如：

```scala
mainClass := Some("kafka.main")
```

redis 连接过多，需要共用连接。
[Spark中redis连接池的几种使用方法](http://mufool.com/2017/07/04/spark-redis/)

**参考**

[Running Spark on Kubernetes](https://spark.apache.org/docs/latest/running-on-kubernetes.html)