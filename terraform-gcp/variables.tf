variable "project_id" {
  default = "mern-amazona-project"
}

variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-a"
}

variable "project_name" {
  default = "mern-amazona"
}

variable "controller_machine_type" {
  default = "e2-medium"
}

variable "kubernetes_machine_type" {
  default = "e2-small"
}

variable "image" {
  default = "ubuntu-os-cloud/ubuntu-2204-lts"
}

variable "ssh_user" {
  default = "ubuntu"
}

variable "ssh_pub_key_path" {
  default = "/home/nourhan14/.ssh/id_rsa.pub"
}