-- RLS Policies for organizations
CREATE POLICY "Master admin can view all organizations"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'master_admin'
    )
  );

CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Master admin can insert organizations"
  ON organizations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'master_admin'
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can view profiles in their organization"
  ON profiles FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Master admin can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'master_admin'
    )
  );

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- RLS Policies for invitations
CREATE POLICY "Users can view invitations for their organization"
  ON invitations FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'master_admin'
    )
  );

CREATE POLICY "Admins can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('master_admin', 'org_admin')
    )
  );

CREATE POLICY "Admins can update invitations"
  ON invitations FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('master_admin', 'org_admin')
    )
  );

-- RLS Policies for organization_members
CREATE POLICY "Users can view members of their organization"
  ON organization_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Master admin can view all members"
  ON organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'master_admin'
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
