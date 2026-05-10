output "jenkins_public_ip" {
  description = "Jenkins Server Public IP"
  value       = google_compute_instance.jenkins.network_interface[0].access_config[0].nat_ip
}

output "k8s_master_public_ip" {
  description = "Kubernetes Master Public IP"
  value       = google_compute_instance.k8s_master.network_interface[0].access_config[0].nat_ip
}

output "k8s_worker_public_ip" {
  description = "Kubernetes Worker Public IP"
  value       = google_compute_instance.k8s_worker.network_interface[0].access_config[0].nat_ip
}
