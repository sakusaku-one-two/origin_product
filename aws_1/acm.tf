data "aws_acm_certificate" "demo_app_certificate" {
  domain  = "*.sakusaku-demo-app.com"
  statuses = ["ISSUED"]
}


