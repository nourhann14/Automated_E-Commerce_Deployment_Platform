# compute.tf — FINAL (VMs only, no firewall, no outputs)

resource "google_compute_instance" "controller" {
  name         = "controller"
  machine_type = var.controller_machine_type   # e2-medium
  zone         = var.zone
  tags         = ["controller", "jenkins", "ssh"]

  boot_disk {
    initialize_params {
      image = var.image
      size  = 20
    }
  }

  network_interface {
    network    = google_compute_network.main.name
    subnetwork = google_compute_subnetwork.public.name

    access_config {}
  }

  metadata = {
    ssh-keys = "ubuntu:${file("~/.ssh/mern-key.pub")}"
  }

  labels = { role = "controller" }
}

resource "google_compute_instance" "kubernetes" {
  name         = "kubernetes"
  machine_type = var.kubernetes_machine_type   # e2-small
  zone         = var.zone
  tags         = ["kubernetes", "k3s", "ssh"]

  boot_disk {
    initialize_params {
      image = var.image
      size  = 20
    }
  }

  network_interface {
    network    = google_compute_network.main.name
    subnetwork = google_compute_subnetwork.public.name

    access_config {}
  }

  metadata = {
    ssh-keys = "ubuntu:${file("~/.ssh/mern-key.pub")}"
  }

  labels = { role = "kubernetes" }
}