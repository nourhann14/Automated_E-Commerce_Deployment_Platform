resource "google_compute_firewall" "jenkins" {
  name    = "${var.project_name}-jenkins-fw"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  target_tags   = ["jenkins"]
  source_ranges = ["0.0.0.0/0"]
}

resource "google_compute_firewall" "kubernetes" {
  name    = "${var.project_name}-k8s-fw"
  network = google_compute_network.main.name

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  allow {
    protocol = "tcp"
    ports    = ["6443"]
  }

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  allow {
    protocol = "tcp"
    ports    = ["3000"]
  }

  allow {
    protocol = "tcp"
    ports    = ["4000"]
  }

  target_tags   = ["kubernetes"]
  source_ranges = ["0.0.0.0/0"]
}
