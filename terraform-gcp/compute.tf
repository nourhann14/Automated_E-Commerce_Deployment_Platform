resource "google_compute_instance" "jenkins" {
  name         = "${var.project_name}-jenkins"
  machine_type = var.jenkins_machine_type
  zone         = var.zone
  tags         = ["jenkins"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 20
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.public.id
    access_config {}
  }

  metadata = {
    ssh-keys = "ubuntu:${file("~/.ssh/mern-key.pub")}"
  }

  labels = {
    project = var.project_name
    role    = "jenkins"
  }
}

resource "google_compute_instance" "k8s_master" {
  name         = "${var.project_name}-k8s-master"
  machine_type = var.k8s_machine_type
  zone         = var.zone
  tags         = ["kubernetes"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 20
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.public.id
    access_config {}
  }

  metadata = {
    ssh-keys = "ubuntu:${file("~/.ssh/mern-key.pub")}"
  }

  labels = {
    project = var.project_name
    role    = "kubernetes-master"
  }
}

resource "google_compute_instance" "k8s_worker" {
  name         = "${var.project_name}-k8s-worker"
  machine_type = var.k8s_machine_type
  zone         = var.zone
  tags         = ["kubernetes"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
      size  = 20
    }
  }

  network_interface {
    subnetwork = google_compute_subnetwork.public.id
    access_config {}
  }

  metadata = {
    ssh-keys = "ubuntu:${file("~/.ssh/mern-key.pub")}"
  }

  labels = {
    project = var.project_name
    role    = "kubernetes-worker"
  }
}
