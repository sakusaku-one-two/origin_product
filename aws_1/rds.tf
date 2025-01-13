resource "aws_db_instance" "example" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "17.2"
  instance_class       = "db.t3.micro"
  identifier           = "exampledb"
  username             = "MY_USER"  # 環境変数 DB_USER に対応
  password             = "SAKUSAKU" # 環境変数 DB_PASSWORD に対応
  parameter_group_name = "default.postgres13"
  skip_final_snapshot  = true
  publicly_accessible  = false
  vpc_security_group_ids = [aws_security_group.demo_app_rds_security_group.id]
  db_subnet_group_name = aws_db_subnet_group.demo_app_rds_subnet_group.name
  port                 = 5432       # 環境変数 DB_PORT に対応
  timezone             = "Asia/Tokyo" # 環境変数 DB_TIMEZONE に対応
}

resource "aws_db_subnet_group" "demo_app_rds_subnet_group" {
  name       = "demo-app-rds-subnet-group"
  subnet_ids = [aws_subnet.demo_app_private_subnet[0].id,aws_subnet.demo_app_private_subnet[1].id]
}

resource "aws_security_group" "demo_app_rds_security_group" {
  name        = "demo-app-rds-security-group"
  description = "Allow database access"
  vpc_id      = aws_vpc.demo_app_vpc.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_subnet.demo_app_dmz_subnet[0].cidr_block,aws_subnet.demo_app_private_subnet[0].cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [aws_subnet.demo_app_dmz_subnet[0].cidr_block,aws_subnet.demo_app_private_subnet[0].cidr_block]
  }
}