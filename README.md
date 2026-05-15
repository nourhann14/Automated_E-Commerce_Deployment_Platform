# 🛒 Automated E-Commerce Deployment Platform

A fully automated DevOps pipeline for deploying a scalable three-tier e-commerce application on Google Cloud Platform using modern DevOps tools and practices.

🌐 **Live Application:** http://136.111.221.77/

---

## 👥 Team Members

| Name | Role |
|---|---|
| Nourhan Ahmed Hassan | DevOps Lead |
| Kirlus Micheal Amin | Infrastructure |
| Israa Fathi Ahmed | CI/CD |
| Abdulaziz Mohamed Hussein | Kubernetes |
| Fatmaa Elzahraa Kamel Fawzy | Monitoring |
| Alhussein Ashraf Fikry | Configuration |

---

## 📌 Project Overview

The Automated E-Commerce Deployment Platform is a DevOps-based project designed to deploy, manage, and monitor a scalable, containerized e-commerce application using modern DevOps tools and cloud infrastructure.

The platform consists of three main tiers:
- **Frontend** — React.js served via Nginx
- **Backend** — Node.js REST API
- **Database** — MySQL 8

---

## 🏗️ Architecture

```
User Browser
     ↓
http://136.111.221.77/
     ↓
┌─────────────────────────────────────────────┐
│         GCP Kubernetes VM (e2-medium)       │
│                                             │
│  ┌──────────┐   ┌──────────┐   ┌─────────┐  │
│  │ Frontend │ → │ Backend  │ → │  MySQL  │  │
│  │  Nginx   │   │ Node.js  │   │    8    │  │
│  │  :80     │   │  :3000   │   │  :3306  │  │
│  └──────────┘   └──────────┘   └─────────┘  │
│                                             │
│              k3s Kubernetes                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│          GCP Controller VM (e2-medium)      │
│              Jenkins + kubectl              │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Tools & Technologies

| Category | Tool | Purpose |
|---|---|---|
| **Frontend** | React.js + Nginx | User interface |
| **Backend** | Node.js + Express | REST API |
| **Database** | MySQL 8 | Data storage |
| **Containerization** | Docker | Package app into containers |
| **Orchestration** | Kubernetes (k3s) | Manage containers |
| **CI/CD** | Jenkins | Automate build and deploy |
| **Infrastructure** | Terraform + GCP | Provision cloud servers |
| **Configuration** | Ansible | Automate server setup |
| **Reverse Proxy** | Nginx | Route traffic |
| **Monitoring** | Prometheus + Grafana | Monitor performance |
| **Version Control** | Git + GitHub | Code management |

---

## 📁 Repository Structure

```
Automated_E-Commerce_Deployment_Platform/
├── ecommerce/
│   ├── backend/
│   │   └── Dockerfile
│   ├── frontend/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   ├── db/
│   │   └── schema.sql
│   |── docker-compose.yml
|   └── Jenkinsfile
├── terraform-gcp/
│   ├── main.tf
│   ├── variables.tf
│   ├── vpc.tf
│   ├── security.tf
│   ├── compute.tf
│   └── outputs.tf
├── ansible/
│   ├── inventory.ini
│   ├── ansible.cfg
│   ├── site.yml
│   └── playbooks/
│       ├── controller.yml
│       ├── jenkins.yml
│       ├── nginx.yml
│       └── setup_k8s_nodes.yml
├── Jenkinsfile
└── README.md
```

---

## ☁️ Infrastructure (Terraform + GCP)

Two GCP Virtual Machines provisioned automatically using Terraform:

| VM | Type | RAM | Purpose |
|---|---|---|---|
| Controller VM | e2-medium | 4GB | Jenkins + kubectl                |
| Kubernetes VM | e2-medium | 4GB | k3s + Frontend + Backend + MySQL |

### Terraform Commands
```bash
cd terraform-gcp

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Create infrastructure
terraform apply

# Destroy when done (saves credits!)
terraform destroy
```

---

## ⚙️ Configuration Management (Ansible)

Ansible automatically installs and configures all software on servers:

```bash
cd ansible

# Test connection to all servers
ansible all_servers -i inventory.ini -m ping

# Run all playbooks
ansible-playbook -i inventory.ini site.yml
```

### Playbooks

| Playbook | Target | What it Does |
|---|---|---|
| `controller.yml` | Controller VM | Installs Jenkins, Ansible, Terraform, kubectl |
| `jenkins.yml` | Controller VM | Configures Jenkins CI/CD server |
| `nginx.yml` | Controller VM | Configures Nginx reverse proxy |
| `setup_k8s_nodes.yml` | Kubernetes VM | Installs k3s and prepares cluster |

---

## 🚀 CI/CD Pipeline (Jenkins)

Every `git push` automatically triggers the full pipeline:

```
Developer pushes code to GitHub
           ↓
    Jenkins detects change
           ↓
    Build Docker images
           ↓
      Run tests
           ↓
  Push images to Docker Hub
           ↓
  Deploy to Kubernetes cluster
           ↓
    Verify deployment health
           ↓
  Rollback if anything fails ✅
```

### Docker Hub Images
```
fatmakamal21/ecommerce-frontend:latest
fatmakamal21/ecommerce-backend:latest
```

---

## ☸️ Kubernetes Deployment (k3s)

The app runs on a lightweight k3s Kubernetes cluster:

### Services

| Service | Type | Internal Port | External Access |
|---|---|---|---|
| Frontend | ClusterIP | 80 | Via Nginx Ingress |
| Backend | ClusterIP | 3000 | Internal only |
| MySQL | ClusterIP | 3306 | Internal only |

---

## 🐳 Docker Compose (Local Development)

Run locally for development:

```bash
cd ecommerce

# Start all services
docker compose up -d

# Access locally
# Frontend: http://localhost:3001
# Backend:  http://localhost:3000

# Stop all services
docker compose down
```

### Services in Docker Compose

| Service | Image | Port |
|---|---|---|
| db | mysql:8 | 30306:3306 |
| backend | fatmakamal21/ecommerce-backend | 3000:3000 |
| frontend | fatmakamal21/ecommerce-frontend | 3001:80 |

---

## 📊 Monitoring (Prometheus + Grafana)

Installed using Helm on the Kubernetes cluster:

```bash
# Install monitoring stack
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

### Dashboards Available
- ✅ CPU & Memory usage per pod
- ✅ Network traffic monitoring
- ✅ Pod health and restart counts
- ✅ Request rates and error rates
- ✅ Kubernetes cluster overview

---

## 🔒 Security

- SSH key-based authentication (no passwords)
- GCP Firewall rules (only required ports open)
- JWT token authentication for API
- Secrets managed via environment variables

---

## 🌍 How to Deploy

### Prerequisites
```
✅ Google Cloud Platform account
✅ Terraform installed
✅ Ansible installed
✅ kubectl installed
✅ Docker + Docker Hub account
✅ SSH key pair generated
```

### Step 1 — Clone Repository
```bash
git clone https://github.com/nourhann14/Automated_E-Commerce_Deployment_Platform.git
cd Automated_E-Commerce_Deployment_Platform
```

### Step 2 — Generate SSH Key
```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/mern-key
```

### Step 3 — Provision GCP Infrastructure
```bash
cd terraform-gcp
terraform init
terraform apply
# Note the output IPs!
```

### Step 4 — Update Ansible Inventory
```ini
[controller]
CONTROLLER_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/mern-key

[kubernetes]
KUBERNETES_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/mern-key
```

### Step 5 — Configure Servers
```bash
cd ansible
ansible-playbook -i inventory.ini site.yml
```

### Step 6 — Access the Application
```
🌐 Live App:  http://136.111.221.77/
📊 Grafana:   http://136.111.221.77:31365
```

---

## 💰 Cost Estimate (GCP)

| Resource | Type | Cost/hour | Cost/day |
|---|---|---|---|
| Controller VM | e2-medium | $0.034 | $0.82 |
| Kubernetes VM | e2-medium | $0.034 | $0.82 |
| Public IPs (2) | Static | $0.008 | $0.19 |
| **Total** | | **$0.076/hr** | **$1.83/day** |

---

## ✅ Deliverables

| # | Deliverable | Status |
|---|---|---|
| 1 | Dockerized e-commerce microservices | ✅ Complete |
| 2 | CI/CD pipelines with Jenkins | ✅ Complete |
| 3 | Kubernetes deployment with k3s | ✅ Complete |
| 4 | Ansible configuration scripts | ✅ Complete |
| 5 | Prometheus + Grafana monitoring | ✅ Complete |
| 6 | Nginx reverse proxy | ✅ Complete |
| 7 | Terraform scripts for GCP | ✅ Complete |
| 8 | Automated rollback strategy | ✅ Complete |
| 9 | Git repository | ✅ Complete |

---

> **Egypt University of Informatics — DevOps Project 2026**