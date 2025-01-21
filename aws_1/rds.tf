variable "db_host" {
  description = "The database host"
  default     = "my_host"
}

variable "db_user" {
  description = "The database user"
  default     = "my_user"
}

variable "db_password" {
  description = "The database password"
  default     = "my_password"
}

variable "db_name" {
  description = "The database name"
  default     = "sakusakudb"
}

variable "db_port" {
  description = "The database port"
  default     = 5432
}

variable "db_ssl" {
  description = "The SSL mode for the database connection"
  default     = "disable"
}

variable "db_timezone" {
  description = "The timezone for the database"
  default     = "Asia/Tokyo"
}



resource "aws_db_instance" "example" {
  allocated_storage    = 20
  db_name                 = "exampledb"
  storage_type            = "gp2"
  engine                  = "postgres"
  engine_version          = "15.7"
  instance_class          = "db.t3.micro"
  identifier           = var.db_name
  username             = var.db_user
  password             = var.db_password
  parameter_group_name = "default.postgres"
  skip_final_snapshot  = true
  deletion_protection = false
  final_snapshot_identifier = "final-snapshot"
  publicly_accessible  = false
  vpc_security_group_ids = [aws_security_group.demo_app_rds_security_group.id]
  db_subnet_group_name = aws_db_subnet_group.demo_app_rds_subnet_group.name
  port                 = var.db_port       # 環境変数 DB_PORT に対応
  # timezone             = "Asia/Tokyo" # 環境変数 DB_TIMEZONE に対応
}


resource "aws_db_parameter_group" "example_group" {
  name = "example-parameter-group"
  family = "postgres15"
  description = "Example parameter group"

  parameter {
    name = "rds.force_ssl"
    value = "0"
  }
  



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
    cidr_blocks = [
      aws_subnet.demo_app_dmz_subnet[0].cidr_block,
      aws_subnet.demo_app_public_subnet[0].cidr_block,
      aws_subnet.demo_app_public_subnet[1].cidr_block,
      aws_subnet.demo_app_dmz_subnet[1].cidr_block,
      
    ]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [
      aws_subnet.demo_app_dmz_subnet[0].cidr_block,
      aws_subnet.demo_app_public_subnet[0].cidr_block,
      aws_subnet.demo_app_public_subnet[1].cidr_block,
      aws_subnet.demo_app_dmz_subnet[1].cidr_block
    ]
  }
}