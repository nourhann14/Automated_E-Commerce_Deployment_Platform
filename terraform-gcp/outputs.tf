output "controller_public_ip" {
  value = google_compute_instance.controller.network_interface[0].access_config[0].nat_ip
}

output "kubernetes_public_ip" {
  value = google_compute_instance.kubernetes.network_interface[0].access_config[0].nat_ip
}